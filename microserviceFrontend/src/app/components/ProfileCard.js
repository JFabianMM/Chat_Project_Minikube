import * as React from 'react';
import Card from '@mui/material/Card';
import { StandardImage } from './StandardImage';

export function ProfileCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
        <StandardImage></StandardImage>
    </Card>
  );
}