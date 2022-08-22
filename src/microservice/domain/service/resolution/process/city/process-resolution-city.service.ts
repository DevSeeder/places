import { Injectable } from '@nestjs/common';
import { EnumTypeAction } from '../../../../enumerators/enum-type-action';
import { ReferenceNeighborhoodsByState } from '../../../../model/references/reference-neighborhoods-by-state.model';
import { Reference } from '../../../../model/references/reference.model';
import { LogActionService } from '../../../logactions/log-action.service';
import { AbstractProcessResolution } from '../abstract-process-resolution.service';

@Injectable()
export abstract class ProcessResolutionCity extends AbstractProcessResolution {
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly actionType: EnumTypeAction
  ) {
    super(logActionService, actionType);
  }

  getReference(reference: Reference): ReferenceNeighborhoodsByState {
    const refObj = new ReferenceNeighborhoodsByState(
      null,
      null,
      null,
      null,
      null,
      null
    );
    return Object.assign(refObj, JSON.parse(JSON.stringify(reference)));
  }
}
