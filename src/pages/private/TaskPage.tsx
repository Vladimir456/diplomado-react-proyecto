import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as PendingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAlert, useAxios } from '../../hooks';

interface Task {
  id: number;
  name: string;
  done: boolean;
}

interface TaskForm {
  name: string;
}

export const TaskPage = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskForm>({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/tasks');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.tasks ?? res.data.data ?? [];
      setTasks(data);
    } catch {
      showAlert('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setForm({ name: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ name: task.name });
    setOpenDialog(true);
  };

  const handleOpenView = (task: Task) => {
    setViewTask(task);
    setOpenViewDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setForm({ name: '' });
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setViewTask(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showAlert('El nombre es obligatorio', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingTask) {
        await axios.put(`/tasks/${editingTask.id}`, { name: form.name });
        showAlert('Tarea actualizada', 'success');
      } else {
        await axios.post('/tasks', { name: form.name });
        showAlert('Tarea creada', 'success');
      }
      await loadTasks();
      handleClose();
    } catch {
      showAlert('Error al guardar tarea', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await axios.patch(`/tasks/${task.id}`, { done: !task.done });
      showAlert(
        task.done ? 'Marcada como pendiente' : 'Tarea completada',
        'success',
      );
      await loadTasks();
    } catch {
      showAlert('Error al cambiar estado', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      showAlert('Tarea eliminada', 'success');
      await loadTasks();
    } catch {
      showAlert('Error al eliminar tarea', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">📝 Mis Tareas</Typography>
        <Chip
          label={`${tasks.filter((t) => !t.done).length} pendientes`}
          color="warning"
        />
      </Box>

      {/* Lista vacía */}
      {tasks.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tienes tareas aún. ¡Crea una!
          </Typography>
        </Box>
      )}

      {/* Grid de tareas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
        }}
      >
        {tasks.map((task) => (
          <Card
            key={task.id}
            elevation={3}
            sx={{
              borderLeft: `4px solid ${task.done ? '#4caf50' : '#ff9800'}`,
              opacity: task.done ? 0.85 : 1,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" noWrap>
                  {task.name}
                </Typography>
                <Chip
                  size="small"
                  label={task.done ? 'Finalizada' : 'Pendiente'}
                  color={task.done ? 'success' : 'warning'}
                />
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', gap: 0.5, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                color="info"
                startIcon={<ViewIcon />}
                onClick={() => handleOpenView(task)}
              >
                Ver
              </Button>

              <Button
                size="small"
                variant="outlined"
                color={task.done ? 'warning' : 'success'}
                startIcon={task.done ? <PendingIcon /> : <CheckIcon />}
                onClick={() => handleToggle(task)}
              >
                {task.done ? 'Pendiente' : 'Completar'}
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleOpenEdit(task)}
              >
                Editar
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(task.id)}
              >
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Botón flotante */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={handleOpenCreate}
      >
        <AddIcon />
      </Fab>

      {/* Modal Ver Tarea */}
      <Dialog open={openViewDialog} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>👁️ Detalle de Tarea</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {viewTask?.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Estado
            </Typography>
            <Chip
              label={viewTask?.done ? 'Finalizada' : 'Pendiente'}
              color={viewTask?.done ? 'success' : 'warning'}
              sx={{ mt: 0.5, mb: 2 }}
            />

            <Typography variant="subtitle2" color="text.secondary">
              ID de Tarea
            </Typography>
            <Typography variant="body1">
              #{viewTask?.id}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Crear/Editar */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la tarea"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            disabled={submitting}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Guardando...' : editingTask ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};