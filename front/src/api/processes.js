import axios from "./axios";

// 🆕 Создать процесс
export const createProcess = async (processData) => {
    try {
        const res = await axios.post('/processes/', processData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось создать процесс';
        return { data: null, error: detail };
    }
};

// 📜 Получить все процессы текущего пользователя
export const getMyProcesses = async () => {
    try {
        const res = await axios.get('/processes/me');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить процессы';
        return { data: null, error: detail };
    }
};

// 🔍 Получить детали конкретного процесса
export const getProcessDetails = async (processId) => {
    try {
        const res = await axios.get(`/processes/${processId}`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить информацию о процессе';
        return { data: null, error: detail };
    }
};

// ✏️ Обновить статус процесса
export const updateProcessStatus = async (processId, statusData) => {
    try {
        const res = await axios.patch(`/processes/${processId}/status`, statusData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось обновить статус процесса';
        return { data: null, error: detail };
    }
};

// 🗑️ Удалить процесс
export const deleteProcess = async (processId) => {
    try {
        const res = await axios.delete(`/processes/${processId}`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось удалить процесс';
        return { data: null, error: detail };
    }
};

// 📊 Получить статистику по процессам
export const getMyProcessesStats = async () => {
    try {
        const res = await axios.get('/processes/me/stats');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить статистику';
        return { data: null, error: detail };
    }
};