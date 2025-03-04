#!/usr/bin/env node
import fs from 'fs';
import { createReadStream } from 'fs';
import { program } from 'commander';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import axios from 'axios';
// Main function
async function main() {
    program
        .requiredOption('-i, --input <file>', 'Input CSV file with NHTSA IDs')
        .requiredOption('-o, --output <file>', 'Output CSV file for detailed results')
        .option('-d, --debug', 'Enable debug mode to see API responses')
        .parse(process.argv);
    const options = program.opts();
    const inputFile = options.input;
    const outputFile = options.output;
    const debug = options.debug || false;
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' does not exist.`);
        process.exit(1);
    }
    console.log(`Reading NHTSA IDs from ${inputFile}...`);
    const recalls = [];
    // Read the input CSV file
    await new Promise((resolve) => {
        createReadStream(inputFile)
            .pipe(csvParser())
            .on('data', (data) => {
            recalls.push(data);
        })
            .on('end', () => {
            resolve();
        });
    });
    console.log(`Found ${recalls.length} recalls to process.`);
    // Fetch details for each recall
    const results = [];
    let headers = [];
    for (const [index, recall] of recalls.entries()) {
        const nhtsaId = recall['NHTSA ID'].trim();
        console.log(`Processing ${index + 1}/${recalls.length}: ${nhtsaId}`);
        try {
            const url = `https://api.nhtsa.gov/recalls/campaignNumber?campaignNumber=${nhtsaId}`;
            console.log(`Calling API: ${url}`);
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json',
                }
            });
            if (debug) {
                console.log('API Response:', JSON.stringify(response.data, null, 2));
            }
            if (response.data.results && response.data.results.length > 0) {
                const result = response.data.results[0];
                // Collect all possible headers
                Object.keys(result).forEach(key => {
                    if (!headers.includes(key)) {
                        headers.push(key);
                    }
                });
                results.push(result);
                console.log(`Successfully retrieved data for ${nhtsaId}`);
            }
            else {
                console.warn(`No results found for NHTSA ID: ${nhtsaId}`);
                if (debug) {
                    console.log('Full API Response:', JSON.stringify(response.data, null, 2));
                }
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(`Error fetching data for ${nhtsaId}: ${error.message}`);
                if (error.response) {
                    console.error(`Status: ${error.response.status}`);
                    console.error(`Data: ${JSON.stringify(error.response.data)}`);
                    if (debug) {
                        console.log('Full Error Response:', JSON.stringify(error.response.data, null, 2));
                    }
                }
            }
            else {
                console.error(`Error fetching data for ${nhtsaId}:`, error);
            }
        }
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (results.length === 0) {
        console.error('No results were found. Output file will not be created.');
        process.exit(1);
    }
    // Create CSV writer with all collected headers
    const csvWriter = createObjectCsvWriter({
        path: outputFile,
        header: headers.map(header => ({ id: header, title: header }))
    });
    // Write results to CSV
    await csvWriter.writeRecords(results);
    console.log(`Successfully wrote ${results.length} records to ${outputFile}`);
}
// Handle errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});
// Run the main function
main().catch(error => {
    console.error('Error in main process:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map