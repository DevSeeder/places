export interface GetSeederService<
  SearchElements,
  ValidOutput,
  ElementDB,
  ResponseDB
> {
  validateAndConvertInput(searchParams: SearchElements): Promise<ValidOutput>;
  searchInDatabase(convertedSearch: ValidOutput): Promise<ResponseDB[]>;
  searchByPuppeterAndSave(
    searchParams: SearchElements,
    convertedSearch: ValidOutput
  ): Promise<ElementDB[]>;
}
