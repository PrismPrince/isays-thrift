const colors = [
  {
    label: 'Red',
    value: 'red',
  },
  {
    label: 'Pink',
    value: 'pink',
  },
  {
    label: 'Purple',
    value: 'purple',
  },
  {
    label: 'Indigo',
    value: 'indigo',
  },
  {
    label: 'Blue',
    value: 'blue',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Teal',
    value: 'teal',
  },
  {
    label: 'Green',
    value: 'green',
  },
  {
    label: 'Lime',
    value: 'lime',
  },
  {
    label: 'Amber',
    value: 'amber',
  },
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Brown',
    value: 'brown',
  },
]

const getColorLabel = value =>
  colors.find(color => color.value === value)?.label ?? ''

export {
  colors,
  getColorLabel,
}