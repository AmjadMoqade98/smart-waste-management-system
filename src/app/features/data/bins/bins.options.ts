export class BinOptions {
  static readonly cols = [
    { field: 'id', header: 'Id' },
    { field: 'area', header: 'Area' },
    { field: 'employee', header: 'Employee' },
    { field: 'status', header: 'Status'},
  ];

  static readonly status = [
    { label: 'All', value: null },
    { label: 'UNDER_THRESHOLD', value: 'UNDER_THRESHOLD' },
    { label: 'ABOUT_TO_THRESHOLD', value: 'ABOUT_TO_THRESHOLD' },
    { label: 'OVER_THRESHOLD', value: 'OVER_THRESHOLD' },
    { label: 'EMERGENCY', value: 'EMERGENCY' },
  ];


}

