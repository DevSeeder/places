export interface FinderDBService<ValidOutput, ResponseDB> {
  searchInDatabase(convertedSearch: ValidOutput): Promise<ResponseDB[]>;
}
