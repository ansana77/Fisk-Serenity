import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';

dotenv.config();
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const isToxic = asyncHandler(async (text) => {
  const client = await google.discoverAPI(DISCOVERY_URL);
  const analyzeRequest = {
    comment: {
      text,
    },
    requestedAttributes: {
      TOXICITY: {},
    },
  };
  const response = await client.comments.analyze({
    key: PERSPECTIVE_API_KEY,
    resource: analyzeRequest,
  });
  const score = response.data.attributeScores.TOXICITY.summaryScore.value;
  const toxic = score > 0.5 ? true : false;
  return toxic;
});

const hasProfanity = (text) => {
  return matcher.hasMatch(text);
};

export { hasProfanity, isToxic };
