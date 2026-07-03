import { ToastService } from './toast.service';

describe('ToastService', () => {
  it('collects success and error toasts with matching styles', () => {
    const service = new ToastService();

    service.success('Saved.');
    service.error('Failed.');

    expect(service.toasts()).toEqual([
      { message: 'Saved.', classname: 'text-bg-success' },
      { message: 'Failed.', classname: 'text-bg-danger' },
    ]);
  });

  it('removes only the given toast', () => {
    const service = new ToastService();
    service.success('First');
    service.success('Second');

    service.remove(service.toasts()[0]);

    expect(service.toasts().map((t) => t.message)).toEqual(['Second']);
  });
});
