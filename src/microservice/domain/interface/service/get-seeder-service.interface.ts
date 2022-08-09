export interface GetSeederService<SearchElements, ValidOutput> {
  validateAndConvertInput(searchParams: SearchElements): Promise<ValidOutput>;
}
