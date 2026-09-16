import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Run against a local emulator only. Never uses production credentials.
let env;
const profile = (uid, role = 'member', churchId = 'church-a', accountStatus = 'active') => ({
  uid, email: `${uid}@example.com`, displayName: 'Test Person', photoURL: null,
  role, churchId, accountStatus, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
});
const db = (uid, verified = true) => env.authenticatedContext(uid, {
  email: `${uid}@example.com`, email_verified: verified,
}).firestore();

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-hand', firestore: {
    host: '127.0.0.1', port: 8180, rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
  } });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const store = context.firestore();
    for (const id of ['church-a', 'church-b']) await setDoc(doc(store, 'churches', id), { name: id, status: 'active' });
    await setDoc(doc(store, 'churches', 'inactive'), { name: 'Inactive', status: 'inactive' });
    for (const data of [profile('member'), profile('admin', 'church_admin'), profile('other', 'member', 'church-b'),
      profile('root', 'super_admin'), profile('suspended', 'church_admin', 'church-a', 'suspended'),
      profile('pending', 'member', 'church-a', 'pending')]) await setDoc(doc(store, 'users', data.uid), data);
    await setDoc(doc(store, 'members', 'other'), { userId: 'other', churchId: 'church-b' });
  });
});
after(async () => { await env?.cleanup(); });

test('public can read active churches but not inactive churches or profiles', async () => {
  const store = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(store, 'churches', 'church-a')));
  await assertFails(getDoc(doc(store, 'churches', 'inactive')));
  await assertFails(getDoc(doc(store, 'users', 'member')));
});
test('registration only permits a valid member/pending profile', async () => {
  await assertFails(setDoc(doc(db('new'), 'users', 'new'), profile('new', 'super_admin')));
  await assertFails(setDoc(doc(db('new'), 'users', 'new'), { ...profile('new', 'member', 'church-a', 'pending'), extraPrivilege: true }));
  await assertFails(setDoc(doc(db('new'), 'users', 'new'), profile('new', 'member', 'inactive', 'pending')));
  await assertSucceeds(setDoc(doc(db('new', false), 'users', 'new'), profile('new', 'member', 'church-a', 'pending')));
});
test('members and church administrators cannot promote themselves', async () => {
  for (const uid of ['member', 'admin']) await assertFails(updateDoc(doc(db(uid), 'users', uid), { role: 'super_admin', updatedAt: serverTimestamp() }));
});
test('church admin cannot grant global privilege or change another tenant', async () => {
  await assertFails(updateDoc(doc(db('admin'), 'users', 'member'), { role: 'super_admin', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(db('admin'), 'users', 'other'), { role: 'leader', updatedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(db('admin'), 'users', 'other')));
  await assertFails(getDoc(doc(db('admin'), 'members', 'other')));
  await assertSucceeds(updateDoc(doc(db('admin'), 'users', 'member'), { role: 'leader', updatedAt: serverTimestamp() }));
});
test('suspended or unverified administrators have no administrative access', async () => {
  await assertFails(getDoc(doc(db('suspended'), 'users', 'member')));
  await assertFails(getDoc(doc(db('admin', false), 'users', 'member')));
});
test('activation requires a verified token; church changes are forbidden', async () => {
  await assertFails(updateDoc(doc(db('pending', false), 'users', 'pending'), { accountStatus: 'active', updatedAt: serverTimestamp() }));
  await assertSucceeds(updateDoc(doc(db('pending'), 'users', 'pending'), { accountStatus: 'active', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(db('pending'), 'users', 'pending'), { churchId: 'church-b', updatedAt: serverTimestamp() }));
});
test('profile field types and timestamps are validated', async () => {
  await assertFails(updateDoc(doc(db('pending'), 'users', 'pending'), { displayName: 123, updatedAt: serverTimestamp() }));
  await assertSucceeds(updateDoc(doc(db('pending'), 'users', 'pending'), { displayName: 'Updated Name', updatedAt: serverTimestamp() }));
});
test('audit entries cannot forge another actor, church, or administrative action', async () => {
  const entry = { actorUid: 'pending', actorRole: 'member', churchId: 'church-a', action: 'sign-in', resource: 'auth', resourceId: 'pending', createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(db('pending'), 'auditLogs', 'valid'), entry));
  await assertFails(setDoc(doc(db('pending'), 'auditLogs', 'forged'), { ...entry, churchId: 'church-b' }));
  await assertFails(setDoc(doc(db('pending'), 'auditLogs', 'promotion'), { ...entry, action: 'role-granted' }));
});
