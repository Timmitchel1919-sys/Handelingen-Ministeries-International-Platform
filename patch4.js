import fs from 'fs';
let file = 'src/features/events/pages/EventDetailsPage.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/import \{ Badge \} from '@\/components\/ui\/Badge';\n/, '');
data = data.replace(/catch \(_err\)/, 'catch');
fs.writeFileSync(file, data);

