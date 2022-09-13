import { post, put } from '/src/services/http-service';

export async function search(options) {
  return await post('/api/devices/search', { pageSize: -1 });
}

export async function update(params) {
  return await put(`/api/devices/status/update`, params);
}

export async function save(data) {
  return await post('/api/devices/create', data);
}
