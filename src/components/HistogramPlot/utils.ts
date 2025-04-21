export function isBarInRange(
  bar: { x0: number; x1: number },
  index: number,
  list: any[],
  filterDomain: any[],
  filterValue: any[],
) {
  // first
  // if x0 <= domain[0] and current value[0] wasn't changed from the original domain
  const x0Condition
    = index === 0 ? bar.x0 <= filterDomain[0] && filterDomain[0] === filterValue[0] : false;
  // Last
  // if x1 >= domain[1] and current value[1] wasn't changed from the original domain
  const x1Condition
    = index === list.length - 1
      ? bar.x1 >= filterDomain[1] && filterDomain[1] === filterValue[1]
      : false;
  return (x0Condition || bar.x0 >= filterValue[0]) && (x1Condition || bar.x1 <= filterValue[1]);
}
