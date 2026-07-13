import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { setSidebarExpanded, setThemeMode } from '../features/layout/layoutSlice';
import type { RootState, AppDispatch } from '../store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const sidebarExpanded = useAppSelector((state) => state.layout.sidebarExpanded);
  const theme = useAppSelector((state) => state.layout.theme);

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <Typography variant="h4" component="h2" gutterBottom>
          Settings
        </Typography>
        {/* <Typography color="text.secondary">
          Configure the workspace layout and visual theme for the full application.
        </Typography> */}
      </div>

      <Stack spacing={3}>
        <div className="border rounded p-3 bg-white">
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <div>
              <Typography variant="h6" gutterBottom>
                Account information
              </Typography>
              {/* <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                View the current account profile. Click to manage and update your details on the account page.
              </Typography> */}
            </div>
            <Button component={Link} to="/settings/account" variant="contained" sx={{ alignSelf: 'center' }}>
              Manage account information
            </Button>
          </Stack>
        </div>

        <div className="border rounded p-3 bg-white">
          <Typography variant="h6" gutterBottom>
            Sidebar layout
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={sidebarExpanded ? 'expanded' : 'collapsed'}
              onChange={(event) => dispatch(setSidebarExpanded(event.target.value === 'expanded'))}
            >
              <FormControlLabel value="expanded" control={<Radio />} label="Expanded" />
              <FormControlLabel value="collapsed" control={<Radio />} label="Collapsed" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="border rounded p-3 bg-white">
          <Typography variant="h6" gutterBottom>
            Application theme
          </Typography>
          <TextField
            select
            label="Theme Mode"
            value={theme}
            onChange={(event) => dispatch(setThemeMode(event.target.value))}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </TextField>
        </div>
      </Stack>
    </div>
  );
}

export default Settings;
