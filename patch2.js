import fs from 'fs';

let file = 'src/features/events/pages/EventAttendancePage.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/setRecords\(fetchedRecords\)/, 'setRecords(fetchedRecords.items as AttendanceRecord[])');
fs.writeFileSync(file, data);

file = 'src/features/events/pages/EventDetailsPage.tsx';
data = fs.readFileSync(file, 'utf8');
data = data.replace(/<Badge tone=\{event\.status === 'CANCELLED' \? 'destructive' : 'default'\}>/g, '<Badge tone={event.status === "CANCELLED" ? "danger" : "neutral"}>');
data = data.replace(/<Badge tone="outline">/g, '<Badge tone="neutral">');
data = data.replace(/<Badge tone="secondary">/g, '<Badge tone="neutral">');
data = data.replace(/variant="destructive"/g, 'variant="outline" className="text-[#a82d42] border-[#a82d42] hover:bg-[#fff1f3]"');
fs.writeFileSync(file, data);

