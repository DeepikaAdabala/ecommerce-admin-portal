import { useState } from 'react';
import { Button, MenuItem, Paper, Stack, TextField, Typography, Alert } from '@mui/material';

const branchOptions = ['Downtown Branch', 'North Avenue Branch', 'West Market Branch', 'Central Plaza Branch', 'Harbor Point Branch'];

function AccountInformation() {
  const [accountInfo, setAccountInfo] = useState({
    username: 'deepika.admin',
    fullName: 'Deepika A',
    email: 'deepika@heliscommerce.com',
    phone: '+91 98765 43210',
    branch: 'Downtown Branch',
  });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (event) => {
    setAccountInfo((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h5" component="h2">
              Account Information
            </Typography>
            <Typography color="text.secondary">
              View your account profile details and update them when needed.
            </Typography>
          </div>
          <Button variant="contained" onClick={() => setEditing(true)}>
            Update details
          </Button>
        </Stack>

        {saved && <Alert severity="success">Account information updated successfully.</Alert>}

        <TextField label="User name" value={accountInfo.username} onChange={handleChange('username')} fullWidth disabled={!editing} />
        <TextField label="Full name" value={accountInfo.fullName} onChange={handleChange('fullName')} fullWidth disabled={!editing} />
        <TextField label="Email ID" type="email" value={accountInfo.email} onChange={handleChange('email')} fullWidth disabled={!editing} />
        <TextField label="Phone number" value={accountInfo.phone} onChange={handleChange('phone')} fullWidth disabled={!editing} />
        <TextField select label="Store branch" value={accountInfo.branch} onChange={handleChange('branch')} sx={{ minWidth: 220 }} disabled={!editing}>
          {branchOptions.map((branch) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </TextField>

        {editing && (
          <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={handleSave}>
            Save changes
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default AccountInformation;
