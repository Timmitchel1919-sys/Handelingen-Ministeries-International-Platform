import fs from 'fs';
let file = 'src/services/hrm-service.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /maritalStatus: reg\.maritalStatus,\n\s*\},/,
  "maritalStatus: reg.maritalStatus,\n        isBaptized: reg.isBaptized,\n      },"
);

data = data.replace(
  /t\.set\(newMemberRef, newMember\);/,
  `t.set(newMemberRef, newMember);

    // Create household and children if needed
    if (reg.hasChildren && reg.children && reg.children.length > 0) {
      const householdRef = doc(collection(db, 'households'));
      t.set(householdRef, {
        churchId: reg.churchId,
        name: \`\${reg.lastName} Household\`,
        primaryMemberId: newMemberRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update primary member with householdId
      t.update(newMemberRef, {
        householdId: householdRef.id,
        householdRole: 'head',
      });

      // Create dependent profiles for children
      reg.children.forEach(child => {
        const childRef = doc(collection(db, 'dependentProfiles'));
        t.set(childRef, {
          churchId: reg.churchId,
          householdId: householdRef.id,
          parentMemberId: newMemberRef.id,
          firstName: child.firstName,
          lastName: child.lastName,
          dateOfBirth: child.dateOfBirth,
          relationshipToPrimaryMember: 'child',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    }`
);

fs.writeFileSync(file, data);

