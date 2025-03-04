# NHTSA Recall Data Fetcher

A command-line tool that fetches detailed recall information from the NHTSA API based on recall IDs provided in a CSV file.

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
node dist/index.js --input <input-csv-file> --output <output-csv-file> [--debug]
```

Example:

```bash
node dist/index.js --input sample-recalls.csv --output detailed-recalls.csv
```

With debug mode:

```bash
node dist/index.js --input sample-recalls.csv --output detailed-recalls.csv --debug
```

## Input CSV Format

The input CSV should contain at least a column named "NHTSA ID" with the recall campaign numbers.

Example:
```
"NHTSA ID","Recall Link","Manufacturer","Subject"
"24V436000","https://www.nhtsa.gov/recalls?nhtsaId=24V436000","Chrysler (FCA US, LLC)","Rearview Camera Image May Not Display"
```

## Output

The tool will generate a CSV file containing all fields from the NHTSA API response for each recall ID.

## API Details

The tool tries multiple NHTSA API endpoints to retrieve recall information:

1. Primary endpoint: `https://api.nhtsa.gov/recalls/campaignNumber/{formattedId}`
2. Alternative endpoint: `https://api.nhtsa.gov/recalls/recallsByNHTSACampaignNumber?campaignNumber={nhtsaId}`

The tool automatically formats the NHTSA ID as required by the API and tries alternative endpoints if the primary one fails.