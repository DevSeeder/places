export const mockGetRegionsByCountryService = {
  searchInDatabase: () => {
    return [];
  }
};

export const mockAggregatedRegions = [
  {
    _id: { region: 'South' },
    count: 3
  },
  {
    _id: { region: 'North' },
    count: 7
  }
];
