import api from './api';

export const paperService = {
  uploadPaper: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  comparePapers: async (paperIds) => {
    const response = await api.post('/compare', { paper_ids: paperIds });
    return response.data;
  },
  generateLiteratureReview: async (prompt, paperIds) => {
    const response = await api.post('/literature-review', { prompt, paper_ids: paperIds });
    return response.data;
  },
  detectNovelty: async (paperId) => {
    const response = await api.post('/novelty', { paper_id: paperId });
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};
