type TForm = {
  name: string;
  address: string;
  officeDays: string[];
  travelType: 'car' | 'public' | 'bike' | '';
  overrideKm?: number | undefined;
  customEuroPerKm?: number | undefined;
  customAgreementNotes?: string | undefined;
  isSubmitting: boolean;
  error?: string | undefined;
  result?: { distanceKm: number; costCents: number } | undefined;
};

type TAction =
  | { type: 'SET'; field: keyof TForm; payload: any }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; payload: TForm['result'] }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: TForm = {
  name: '',
  address: '',
  officeDays: [],
  travelType: '',
  overrideKm: undefined,
  customEuroPerKm: undefined,
  customAgreementNotes: undefined,
  isSubmitting: false,
  error: undefined,
  result: undefined,
};

function createEmployeeFormReducer(s: TForm, a: TAction): TForm {
  switch (a.type) {
    case 'SET':
      return { ...s, [a.field]: a.payload };
    case 'SUBMIT':
      return { ...s, isSubmitting: true, error: undefined, result: undefined };
    case 'SUCCESS':
      return { ...s, isSubmitting: false, result: a.payload, error: undefined };
    case 'ERROR':
      return { ...s, isSubmitting: false, error: a.payload, result: undefined };
    case 'RESET':
      return initialState;
    default:
      return s;
  }
}

export { createEmployeeFormReducer, initialState };
export type { TForm, TAction };
