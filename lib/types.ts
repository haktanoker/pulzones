export interface ActivitySummary {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date_local: string;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  average_speed: number;
}
