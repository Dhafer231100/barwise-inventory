
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UserPlus, Shield } from "lucide-react";

// Mock staff data
const MOCK_STAFF = [
  { id: '1', name: 'John Manager', email: 'manager@hotel.com', role: 'manager' as UserRole, barId: '1', barName: 'Main Bar' },
  { id: '2', name: 'Alice Bartender', email: 'bartender@hotel.com', role: 'bartender' as UserRole, barId: '1', barName: 'Main Bar' },
  { id: '3', name: 'Bob Inventory', email: 'inventory@hotel.com', role: 'inventory_staff' as UserRole, barId: null, barName: null },
  { id: '4', name: 'Emma Bartender', email: 'emma@hotel.com', role: 'bartender' as UserRole, barId: '2', barName: 'Pool Bar' },
  { id: '5', name: 'David Inventory', email: 'david@hotel.com', role: 'inventory_staff' as UserRole, barId: null, barName: null },
];

// Mock bar data
const MOCK_BARS = [
  { id: '1', name: 'Main Bar', location: 'Lobby Floor' },
  { id: '2', name: 'Pool Bar', location: 'Pool Area' },
  { id: '3', name: 'Rooftop Bar', location: 'Roof Level' },
];

export default function Users() {
  const { user } = useAuth();
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'bartender' as UserRole,
    barId: '',
  });
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_STAFF[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Redirect if not manager
  if (user?.role !== 'manager') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }
  
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would be an API call
    const id = (staff.length + 1).toString();
    const barName = newUser.barId 
      ? MOCK_BARS.find(bar => bar.id === newUser.barId)?.name 
      : null;
      
    setStaff([
      ...staff,
      {
        id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        barId: newUser.barId || null,
        barName: barName,
      }
    ]);
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'bartender',
      barId: '',
    });
    
    setIsAddDialogOpen(false);
    toast.success("User added successfully");
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // Update user in the staff list
    const updatedStaff = staff.map(s => 
      s.id === selectedUser.id ? selectedUser : s
    );
    
    setStaff(updatedStaff);
    setIsEditDialogOpen(false);
    toast.success("User updated successfully");
  };
  
  const handleEditClick = (user: typeof MOCK_STAFF[0]) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteUser = (id: string) => {
    // In a real app, this would be an API call
    setStaff(staff.filter(user => user.id !== id));
    toast.success("User removed successfully");
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-500';
      case 'bartender':
        return 'bg-emerald-500';
      case 'inventory_staff':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage hotel staff members and their access privileges.
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Create a new user account for a staff member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="bartender">Bartender</SelectItem>
                      <SelectItem value="inventory_staff">Inventory Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === 'bartender' && (
                  <div className="grid gap-2">
                    <Label htmlFor="bar">Assigned Bar</Label>
                    <Select 
                      value={newUser.barId} 
                      onValueChange={(value) => setNewUser({...newUser, barId: value})}
                    >
                      <SelectTrigger id="bar">
                        <SelectValue placeholder="Select a bar" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_BARS.map(bar => (
                          <SelectItem key={bar.id} value={bar.id}>
                            {bar.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Bar</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(staffMember.role)} text-white`}>
                        {staffMember.role === 'inventory_staff' ? 'Inventory' : 
                          staffMember.role.charAt(0).toUpperCase() + staffMember.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{staffMember.barName || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(staffMember)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(staffMember.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff member information.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value: UserRole) => {
                    // Reset barId if changing from bartender to another role
                    if (value !== 'bartender') {
                      setSelectedUser({...selectedUser, role: value, barId: null, barName: null});
                    } else {
                      setSelectedUser({...selectedUser, role: value});
                    }
                  }}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="bartender">Bartender</SelectItem>
                    <SelectItem value="inventory_staff">Inventory Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedUser.role === 'bartender' && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-bar">Assigned Bar</Label>
                  <Select 
                    value={selectedUser.barId || ''} 
                    onValueChange={(value) => {
                      const barName = MOCK_BARS.find(bar => bar.id === value)?.name || null;
                      setSelectedUser({...selectedUser, barId: value, barName: barName});
                    }}
                  >
                    <SelectTrigger id="edit-bar">
                      <SelectValue placeholder="Select a bar" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_BARS.map(bar => (
                        <SelectItem key={bar.id} value={bar.id}>
                          {bar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
