'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  ButtonGroup,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Mock data for our charts
const weeklyCaloriesData = [
  { day: 'Mon', calories: 1850, target: 2000 },
  { day: 'Tue', calories: 2100, target: 2000 },
  { day: 'Wed', calories: 1970, target: 2000 },
  { day: 'Thu', calories: 2250, target: 2000 },
  { day: 'Fri', calories: 1800, target: 2000 },
  { day: 'Sat', calories: 2400, target: 2000 },
  { day: 'Sun', calories: 2150, target: 2000 },
];

const macronutrientData = [
  { name: 'Protein', value: 30, fill: '#8884d8' },
  { name: 'Carbs', value: 45, fill: '#82ca9d' },
  { name: 'Fat', value: 25, fill: '#ffc658' },
];

const monthlyProgressData = [
  { month: 'Jan', weight: 82, target: 80 },
  { month: 'Feb', weight: 81.2, target: 79 },
  { month: 'Mar', weight: 80.5, target: 78 },
  { month: 'Apr', weight: 79.8, target: 77 },
  { month: 'May', weight: 78.5, target: 76 },
  { month: 'Jun', weight: 77.8, target: 75 },
];

const nutrientIntakeData = [
  { name: 'Vitamin A', actual: 85, recommended: 100 },
  { name: 'Vitamin C', actual: 120, recommended: 100 },
  { name: 'Vitamin D', actual: 60, recommended: 100 },
  { name: 'Calcium', actual: 95, recommended: 100 },
  { name: 'Iron', actual: 75, recommended: 100 },
  { name: 'Fiber', actual: 90, recommended: 100 },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => setTimeRange('week')}
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button
            onClick={() => setTimeRange('month')}
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button
            onClick={() => setTimeRange('year')}
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Average Daily Calories
              </Typography>
              <Typography variant="h4">2,074</Typography>
              <Typography variant="body2" color="text.secondary">
                vs target: 2,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Protein Intake
              </Typography>
              <Typography variant="h4">92g</Typography>
              <Typography variant="body2" color="text.secondary">
                30% of total calories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Water Intake
              </Typography>
              <Typography variant="h4">2.1L</Typography>
              <Typography variant="body2" color="text.secondary">
                vs target: 2.5L
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Weight
              </Typography>
              <Typography variant="h4">77.8kg</Typography>
              <Typography variant="body2" color="text.secondary">
                -0.7kg this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Calories Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Calorie Intake
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={weeklyCaloriesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Calories Consumed"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  name="Target Calories"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Macronutrient Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Macronutrient Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macronutrientData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {macronutrientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Weight Progress Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weight Progress
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyProgressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  name="Actual Weight"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#82ca9d"
                  name="Target Weight"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Nutrient Intake Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nutrient Intake (% of RDI)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={nutrientIntakeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 150]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="actual"
                  name="Actual Intake"
                  fill="#8884d8"
                  background={{ fill: '#eee' }}
                />
                <Bar
                  dataKey="recommended"
                  name="Recommended"
                  fill="#82ca9d"
                  radius={[0, 10, 10, 0]}
                  opacity={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
