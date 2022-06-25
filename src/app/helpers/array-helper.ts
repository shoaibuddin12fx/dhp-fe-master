export const countryArr = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hong Kong',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Kenya',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Saudi Arabia',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'United Arab Emirates',
  'United Kingdom',
];
export const cityArr = ['Karachi', 'Lahore', 'Islamabad', 'New York', 'London'];

export const convertArrToCommaSepString = (arr: any[]) => {
  let str = '';
  arr.forEach((element, index) => {
    str += `'${element}'${index == arr.length - 1 ? '' : ','}`;
  });
  return str;
};

export const convertArrToCommaSepNumber = (arr: any[]) => {
  let str = '';
  arr.forEach((element, index) => {
    str += `${element}${index == arr.length - 1 ? '' : ','}`;
  });
  return str;
};
