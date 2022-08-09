export interface SeederService<SearchElements, ValidOutput, Response> {
  searchByPuppeterAndSave(
    searchParams: SearchElements,
    convertedSearch: ValidOutput
  ): Promise<Response[]>;
}
