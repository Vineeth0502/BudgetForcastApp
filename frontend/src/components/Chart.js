//components/Chart.js
/**
 * File name: Chart.js
 * Description: This component renders a line chart using Chart.js and react-chartjs-2.
 *               It sets up the necessary Chart.js components and registers them.
 */
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
