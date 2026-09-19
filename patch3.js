import fs from 'fs';

let file = 'src/features/events/pages/EventDetailsPage.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/description=\{[\s\S]*?\}\s*actions/, 'actions'); // Remove the description block until actions
data = data.replace(/catch \(err\)/, 'catch (_err)');
fs.writeFileSync(file, data);

