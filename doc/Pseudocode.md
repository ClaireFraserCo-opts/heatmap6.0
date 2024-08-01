# Pseudocode for Heatmap Generation


## 1. Get Data
   a. Retrieve JSON Array
   b. Obtain summary length (word count)
   c. Get frequent words and their frequencies
   d. Retrieve persona data

## 2. Process Data
   a. Generate an array representing each second of the session

## 3. Process Utterance Block
   a. Initialize index to 0 (representing the start of the session)
   b. Loop through each utterance:
      i. If the start time of the utterance rounds to the current index:
         a. Set cell color based on the percentile of word frequency and speaker
      ii. If the start time is greater than the current index:
         a. Color the cells representing silence from the end of the previous utterance to the start of the current one

## 4. Process Word Block
   a. Loop through the word frequencies block:
      i. Identify the top 25 frequent words
      ii. If a word in an utterance matches one of the top 25 words:
         a. Mark the cell at the start time of the word with a cross ("X")
         b. Color the cell based on the speaker of the word, if applicable

## 5. Final Array
   a. Ensure the index exceeds the session length
   b. Apply colors to cells and mark frequent words with crosses
   c. Include word information in the final heatmap array

## 6. Percentile Calculation
   a. Calculate percentiles for each utterance based on word frequency
   b. Map percentiles to color shades for cell coloring
   c. Ensure that cells with silence are set to grey

## 7. Handle Text or Silence
   a. Distinguish between cells representing text (utterances) and silence
   b. Apply appropriate color and markers based on content (utterance or silence)
