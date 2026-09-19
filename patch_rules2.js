import fs from 'fs';
let data = fs.readFileSync('firestore.rules', 'utf8');

const newRules = `
    match /households/{id} {
      allow read: if sameChurch(resource.data.churchId) && staff(resource.data.churchId);
      allow create, update, delete: if sameChurch(resource.data.churchId) && staff(resource.data.churchId);
    }
    match /dependentProfiles/{id} {
      allow read: if sameChurch(resource.data.churchId) && staff(resource.data.churchId);
      allow create, update, delete: if sameChurch(resource.data.churchId) && staff(resource.data.churchId);
    }
`;

data = data.replace(/match \/members\/\{memberId\} \{/, newRules + '    match /members/{memberId} {');

fs.writeFileSync('firestore.rules', data);

