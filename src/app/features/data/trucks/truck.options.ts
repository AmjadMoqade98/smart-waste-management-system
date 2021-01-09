export class TruckOptions {
  static readonly cols = [
    { field: 'number', header: 'number' },
    { field: 'area', header: 'Area' },
    { field: 'employee', header: 'Employee' },
    { field: 'status', header: 'Status'},
  ];

  static readonly status = [
    { label: 'All', value: null },
    { label: 'Used', value: 'Used' },
    { label: 'Free', value: 'Free' },
  ];
}
