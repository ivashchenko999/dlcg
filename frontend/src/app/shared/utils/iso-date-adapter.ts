import { Injectable } from '@angular/core';
import { NgbDateAdapter, type NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/** Binds NgbDatepicker to the ISO "yyyy-MM-dd" strings used by the API. */
@Injectable()
export class IsoStringDateAdapter extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split('-').map(Number);
    return { year, month, day };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) {
      return null;
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${String(date.year)}-${pad(date.month)}-${pad(date.day)}`;
  }
}
