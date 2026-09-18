import api from './api';

export const uploadPaper = async (file, examName, releaseTimestamp) => {
  const formData = new FormData();
  formData.append('paper', file);
  formData.append('examName', examName);
  formData.append('timeStamp', releaseTimestamp);
  const { data } = await api.post('/exam/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const grantAccess = async (examName, address) => {
  const { data } = await api.post('/exam/grant-access', { examName, address });
  return data;
};

export const retrievePaper = async (examName, address) => {
  const response = await api.get(`/exam/retrieve/${encodeURIComponent(examName)}/${address}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getPaperInfo = async (examName) => {
  const { data } = await api.get(`/exam/info/${encodeURIComponent(examName)}`);
  return data;
};
export const getAuditLogs = async () => {
  const { data } = await api.get('/exam/audit-logs');
  return data;
};
