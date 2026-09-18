
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// import { Table } from '@/components/ui/Table';

export function EventAttendancePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock attendance data
  const attendanceRecords = [
    { id: '1', memberName: 'John Doe', status: 'PRESENT', checkInTime: new Date().toISOString() },
    { id: '2', memberName: 'Jane Smith', status: 'ABSENT', checkInTime: null },
  ];

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Event Attendance" 
        description={`Tracking attendance for event ID: ${eventId}`}
        actions={
          <Button variant="outline" onClick={() => navigate(`/events/${eventId}`)}>
            Back to Event
          </Button>
        }
      />
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Attendees</h3>
          <Button>Scan QR / Mark Attendance</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200">Name</th>
                <th className="px-6 py-3 border-b border-gray-200">Status</th>
                <th className="px-6 py-3 border-b border-gray-200">Check-In Time</th>
                <th className="px-6 py-3 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-4">{record.memberName}</td>
                  <td className="px-6 py-4">{record.status}</td>
                  <td className="px-6 py-4">
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" className="mr-2">Present</Button>
                    <Button variant="outline" size="sm">Absent</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendanceRecords.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No attendance records found.
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
