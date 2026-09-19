const fs = require('fs');

let file = 'src/features/events/pages/EventAttendancePage.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/setRecords\(records\)/, 'setRecords(records.items)');
data = data.replace(/user\.uid/g, 'user.id');
fs.writeFileSync(file, data);

file = 'src/features/events/pages/EventDetailsPage.tsx';
data = fs.readFileSync(file, 'utf8');
data = data.replace(/backTo=\{\`\/events\`\}/, '');
data = data.replace(/backTo="\/events"/, '');
data = data.replace(/title=\{\s*<div[^>]*>([\s\S]*?)<\/div>\s*\}/, 'title={String($1)}');
data = data.replace(/<Badge variant=/g, '<Badge tone=');
data = data.replace(/tone="destructive"/g, 'variant="outline" className="text-[#a82d42] border-[#a82d42]"');
data = data.replace(/tone="secondary"/g, 'tone="neutral"');
fs.writeFileSync(file, data);

file = 'src/services/attendance-service.ts';
data = fs.readFileSync(file, 'utf8');
data = data.replace(/repo\.delete/g, 'repo.remove');
fs.writeFileSync(file, data);

file = 'src/services/event-registration-service.ts';
data = fs.readFileSync(file, 'utf8');
data = data.replace(/collection,\n\s*doc,\n\s*getDoc,\n\s*getDocs,\n\s*query,\n\s*runTransaction,\n\s*where,\n\s*type QueryConstraint/g, 'doc, runTransaction, where, type QueryConstraint');
fs.writeFileSync(file, data);

file = 'src/services/event-service.ts';
data = fs.readFileSync(file, 'utf8');
data = data.replace(/import \{ where, type QueryConstraint, runTransaction, doc \} from 'firebase\/firestore';/, "import { where, type QueryConstraint } from 'firebase/firestore';");
data = data.replace(/import \{ getFirebaseFirestore \} from '@\/lib\/firebase';\n/, '');
fs.writeFileSync(file, data);
