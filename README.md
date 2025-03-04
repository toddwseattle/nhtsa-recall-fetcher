# NHTSA Recall Data Fetcher

A command-line tool that fetches detailed recall information from the NHTSA API based on recall IDs provided in a CSV file.

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
get-nhtsa-detail --input <input-csv-file> --output <output-csv-file> [--debug]
```

Example:

```bash
get-nhtsa-detail --input [sample-recalls.csv](sample-recalls.csv) --output detailed-recalls.csv
```

With debug mode:

```bash
get-nhtsa-detail --input [sample-recalls.csv](sample-recalls.csv) --output detailed-recalls.csv --debug
```

## Input CSV Format

The input CSV should contain at least a column named "NHTSA ID" with the recall campaign numbers.

Example:
```
"NHTSA ID","Recall Link","Manufacturer","Subject"
"24V436000","https://www.nhtsa.gov/recalls?nhtsaId=24V436000","Chrysler (FCA US, LLC)","Rearview Camera Image May Not Display"
```

## Output

The tool will generate a CSV file containing all fields from the NHTSA API response for each recall ID. The file
[sample-recalls.csv](sample-recalls.csv) contains a sample input file and [out-recalls.csv](out-recalls.csv) contains the output file generated from the sample input file.

## API Details

The tool uses this NHTSA API endpoint to retrieve recall information:

 `https://api.nhtsa.gov/recalls/recallsByNHTSACampaignNumber?campaignNumber={nhtsaId}`
