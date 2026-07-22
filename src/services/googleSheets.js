const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

const SHEETS = {
  settings: 'Settings',
  places: 'Places',
  people: 'People',
  expenses: 'Expenses',
  checklist: 'Checklist',
};

const requiredSheetId = () => {
  if (!SHEET_ID) {
    console.log(SHEET_ID);
    throw new Error('Google Sheets is not configured. Set VITE_GOOGLE_SHEET_ID before building the app.');
  }
};

const toBoolean = (value) => value === true || String(value).trim().toLowerCase() === 'true';
const toNumber = (value) => Number(value) || 0;

const cellValue = (cell) => {
  const value = cell?.v ?? '';
  const dateMatch = typeof value === 'string' && value.match(/^Date\((\d+),(\d+),(\d+)/);
  if (!dateMatch) return value;
  const [, year, month, day] = dateMatch;
  return `${year}-${String(Number(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const parseGoogleResponse = (payload) => {
  const match = payload.match(/google\.visualization\.Query\.setResponse\((.*)\);?\s*$/s);
  if (!match) throw new Error('Google Sheets returned an unexpected response.');

  const table = JSON.parse(match[1]).table;
  const headers = table.cols.map((column) => column.label.trim());
  return table.rows
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, cellValue(row.c[index])])))
    .filter((row) => Object.values(row).some((value) => value !== ''));
};

const getSheetRows = async (sheetName) => {
  const url = new URL(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`);
  url.searchParams.set('tqx', 'out:json');
  url.searchParams.set('sheet', sheetName);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load the ${sheetName} worksheet.`);
  return parseGoogleResponse(await response.text());
};

const mapPlace = (row) => ({ ...row, id: String(row.id) });
const mapPerson = (row) => ({ ...row, id: String(row.id), invitationSent: toBoolean(row.invitationSent) });
const mapExpense = (row) => ({ ...row, id: String(row.id), amount: toNumber(row.amount) });
const mapChecklist = (row) => ({ ...row, id: String(row.id), completed: toBoolean(row.completed) });

export const loadWeddingDataFromGoogleSheets = async () => {
  requiredSheetId();
  const [settingsRows, places, people, expenses, checklist] = await Promise.all([
    getSheetRows(SHEETS.settings),
    getSheetRows(SHEETS.places),
    getSheetRows(SHEETS.people),
    getSheetRows(SHEETS.expenses),
    getSheetRows(SHEETS.checklist),
  ]);

  if (!settingsRows.length) throw new Error('The Settings worksheet needs one data row.');

  return {
    settings: { ...settingsRows[0], totalBudget: toNumber(settingsRows[0].totalBudget) },
    places: places.map(mapPlace),
    people: people.map(mapPerson),
    expenses: expenses.map(mapExpense),
    checklist: checklist.map(mapChecklist),
  };
};
