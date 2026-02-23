// src/app/dashboard/iot-controls/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Zap,
  Shield,
  Settings,
  Activity,
  BarChart3,
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Power,
  Droplet,
  ThermometerSun,
  Wind as WindIcon,
  Waves,
  
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  
  Umbrella,
  ThermometerSnowflake,
  ThermometerIcon,
  Droplet as DropletIcon,
  Wind as WindIcon2,
  Thermometer as ThermometerIcon2,
  Settings as SettingsIcon,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Mic,
  MicOff,
  Radio,
  Bluetooth,
  Wifi as WifiIcon,
  SatelliteDish,
  Router,
  Cpu as CpuIcon,
  MemoryStick,
  HardDrive as HardDriveIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Network as NetworkIcon,
  Shield as ShieldIcon,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
  Activity as ActivityIcon,
  Heart,
  HeartPulse,
  Brain,
  Sparkles,
  MessageSquare,
  HelpCircle,
  BookOpen,
  FileText,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  CheckSquare,
  Square,
  Play,
  Pause,
  StopCircle,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  PowerOff,
  Power as PowerIcon,
  ToggleLeft,
  ToggleRight,
  ToggleRight as ToggleRightIcon,
  ToggleLeft as ToggleLeftIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Palette,
  PaintBucket,
  Layers,
  Grid,
  List,
  Grid3X3,
  Columns,
  Rows,
  Layout,
  SidebarClose,
  SidebarOpen,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Maximize2,
  Minimize2,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move as MoveIcon,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Code,
  Terminal,
  Command,
  Cpu as CpuIcon2,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Watch,
  Headphones,
  Speaker,
  Mic as MicIcon,
  Video as VideoIcon,
  Camera as CameraIcon,
  Image,
  Film,
  Music,
  Headphones as HeadphonesIcon,
  Radio as RadioIcon,
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon2,
  Satellite as SatelliteIcon,
  Router as RouterIcon,
  Cpu as CpuIcon3,
  MemoryStick as MemoryStickIcon,
  HardDrive as HardDriveIcon2,
  Database as DatabaseIcon2,
  Server as ServerIcon2,
  Network as NetworkIcon2,
  Shield as ShieldIcon2,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key as KeyIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  Activity as ActivityIcon2,
  Heart as HeartIcon,
  HeartPulse as HeartPulseIcon,
  Brain as BrainIcon,
  Sparkles as SparklesIcon,
  MessageSquare as MessageSquareIcon,
  HelpCircle as HelpCircleIcon,
  BookOpen as BookOpenIcon,
  FileText as FileTextIcon,
  Clipboard as ClipboardIcon,
  ClipboardCheck as ClipboardCheckIcon,
  ClipboardX as ClipboardXIcon,
  CheckSquare as CheckSquareIcon,
  Square as SquareIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  StopCircle as StopCircleIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  FastForward as FastForwardIcon,
  Rewind as RewindIcon,
  PowerOff as PowerOffIcon,
  Power as PowerIcon2,
  ToggleLeft as ToggleLeftIcon2,
  ToggleRight as ToggleRightIcon2,
  Sun as SunIcon2,
  Palette as PaletteIcon,
  PaintBucket as PaintBucketIcon,
  Layers as LayersIcon,
  Grid as GridIcon,
  List as ListIcon,
  Grid3X3 as Grid3X3Icon,
  Columns as ColumnsIcon,
  Rows as RowsIcon,
  Layout as LayoutIcon,
  Sidebar as SidebarIcon,
  SidebarClose as SidebarCloseIcon,
  SidebarOpen as SidebarOpenIcon,
  Menu as MenuIcon,
  X as XIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share2 as Share2Icon,
  Copy as CopyIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Move as MoveIcon2,
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  RotateCw as RotateCwIcon,
  RotateCcw as RotateCcwIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Move as MoveIcon3,
  GitBranch as GitBranchIcon,
  GitCommit as GitCommitIcon,
  GitPullRequest as GitPullRequestIcon,
  GitMerge as GitMergeIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  Command as CommandIcon,
  Cpu as CpuIcon4,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Tv as TvIcon,
  Watch as WatchIcon,
  Headphones as HeadphonesIcon2,
  Speaker as SpeakerIcon,
  Mic as MicIcon2,
  Video as VideoIcon2,
  Camera as CameraIcon2,
  Image as ImageIcon,
  Film as FilmIcon,
  Music as MusicIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  CloudLightning as CloudLightningIcon,
  CloudSnow as CloudSnowIcon,
  CloudFog as CloudFogIcon,
  Tornado as TornadoIcon,
  Hurricane as HurricaneIcon,
  Umbrella as UmbrellaIcon,
  Water as WaterIcon,
  ThermometerSnowflake as ThermometerSnowflakeIcon,
  Thermometer as ThermometerIcon3,
  Droplet as DropletIcon2,
  Wind as WindIcon3,
  Activity as ActivityIcon3,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  Gauge as GaugeIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  RefreshCw as RefreshCwIcon,
  Power as PowerIcon3,
  Droplet as DropletIcon3,
  ThermometerSun as ThermometerSunIcon,
  Wind as WindIcon4,
  Waves as WavesIcon,
  Leaf as LeafIcon,
  Tractor as TractorIcon,
  Sprout as SproutIcon,
  TreePine as TreePineIcon,
  Wheat as WheatIcon,
  Cow as CowIcon,
  Fish as FishIcon,
  Egg as EggIcon,
  Apple as AppleIcon,
  Carrot as CarrotIcon,
  Coffee as CoffeeIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AlertOctagon as AlertOctagonIcon,
  Battery as BatteryIcon,
  Wifi as WifiIcon3,
  Signal as SignalIcon,
  Cpu as CpuIcon5,
  HardDrive as HardDriveIcon3,
  Database as DatabaseIcon3,
  Server as ServerIcon3,
  Network as NetworkIcon3,
  WifiOff as WifiOffIcon,
  Satellite as SatelliteIcon2,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
  Globe as GlobeIcon,
  Compass as CompassIcon,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  Moon as MoonIcon2,
  Star as StarIcon,
  CloudOff as CloudOffIcon,
  Snowflake as SnowflakeIcon
} from "lucide-react";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ReferenceLine,
  Label
} from "recharts";

// Loading component
const IoTLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Loading IoT controls and sensor data...
      </p>
    </div>
  </div>
);

// Types
interface SensorData {
  id: number;
  type: "temperature" | "humidity" | "soil_moisture" | "light" | "co2" | "ph" | "water_level" | "wind_speed";
  value: number;
  unit: string;
  timestamp: string;
  location: string;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  min: number;
  max: number;
  optimal: number;
}

interface Actuator {
  id: number;
  name: string;
  type: "pump" | "valve" | "light" | "fan" | "heater" | "cooler" | "gate" | "alarm";
  status: "on" | "off" | "auto";
  power: number; // percentage
  lastAction: string;
  schedule?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy";
  description: string;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  feelsLike: number;
  visibility: number;
  precipitation: number;
}

interface Alert {
  id: number;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: string;
  sensorId?: number;
  actuatorId?: number;
  resolved: boolean;
}

// Initial sample data
const initialSensorData: SensorData[] = [
  {
    id: 1,
    type: "temperature",
    value: 25.4,
    unit: "°C",
    timestamp: "2024-01-15 14:30:00",
    location: "Greenhouse 1",
    status: "normal",
    trend: "up",
    min: 18,
    max: 35,
    optimal: 25
  },
  {
    id: 2,
    type: "humidity",
    value: 68,
    unit: "%",
    timestamp: "2024-01-15 14:30:00",
    location: "Greenhouse 1",
    status: "normal",
    trend: "stable",
    min: 40,
    max: 80,
    optimal: 65
  },
  {
    id: 3,
    type: "soil_moisture",
    value: 42,
    unit: "%",
    timestamp: "2024-01-15 14:30:00",
    location: "Field A",
    status: "warning",
    trend: "down",
    min: 30,
    max: 70,
    optimal: 50
  },
  {
    id: 4,
    type: "light",
    value: 850,
    unit: "lux",
    timestamp: "2024-01-15 14:30:00",
    location: "Greenhouse 2",
    status: "normal",
    trend: "down",
    min: 300,
    max: 1200,
    optimal: 800
  },
  {
    id: 5,
    type: "co2",
    value: 420,
    unit: "ppm",
    timestamp: "2024-01-15 14:30:00",
    location: "Greenhouse 1",
    status: "normal",
    trend: "stable",
    min: 300,
    max: 1000,
    optimal: 400
  },
  {
    id: 6,
    type: "ph",
    value: 6.8,
    unit: "pH",
    timestamp: "2024-01-15 14:30:00",
    location: "Hydroponic Tank",
    status: "warning",
    trend: "down",
    min: 5.5,
    max: 7.5,
    optimal: 6.5
  }
];

const initialActuators: Actuator[] = [
  {
    id: 1,
    name: "Main Water Pump",
    type: "pump",
    status: "auto",
    power: 75,
    lastAction: "2024-01-15 14:15:00",
    schedule: {
      enabled: true,
      startTime: "06:00",
      endTime: "18:00",
      days: ["Mon", "Wed", "Fri", "Sun"]
    }
  },
  {
    id: 2,
    name: "Irrigation Valve A",
    type: "valve",
    status: "off",
    power: 0,
    lastAction: "2024-01-15 13:45:00"
  },
  
  {
    id: 5,
    name: "Heating System",
    type: "heater",
    status: "off",
    power: 0,
    lastAction: "2024-01-15 08:30:00"
  },
  
];

const initialWeatherData: WeatherData = {
  temperature: 25.4,
  humidity: 68,
  pressure: 1013,
  windSpeed: 12,
  windDirection: 180,
  condition: "sunny",
  description: "Clear sky",
  sunrise: "06:45",
  sunset: "18:30",
  uvIndex: 6,
  feelsLike: 26,
  visibility: 10,
  precipitation: 0
};

const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "warning",
    message: "Soil moisture level below optimal in Field A",
    timestamp: "2024-01-15 14:25:00",
    sensorId: 3,
    resolved: false
  },
  {
    id: 2,
    type: "critical",
    message: "pH level dropping in Hydroponic Tank",
    timestamp: "2024-01-15 13:15:00",
    sensorId: 6,
    resolved: false
  },
  {
    id: 3,
    type: "info",
    message: "Irrigation cycle completed successfully",
    timestamp: "2024-01-15 12:30:00",
    actuatorId: 1,
    resolved: true
  }
];

// Component: SensorCard
const SensorCard = ({ sensor }: { sensor: SensorData }) => {
  const getIcon = (type: SensorData["type"]) => {
    switch (type) {
      case "temperature": return Thermometer;
      case "humidity": return Droplets;
      case "soil_moisture": return Droplet;
      case "light": return Sun;
      case "co2": return Cloud;
      case "ph": return Activity;
      case "water_level": return Waves;
      case "wind_speed": return Wind;
      default: return Activity;
    }
  };

  const getStatusColor = (status: SensorData["status"]) => {
    switch (status) {
      case "normal": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getProgressColor = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 30) return "bg-red-500";
    if (percentage < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const Icon = getIcon(sensor.type);
  const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;

  return (
    <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white capitalize">
              {sensor.type.replace('_', ' ')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{sensor.location}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(sensor.status)}`}>
          {sensor.status === "normal" ? <CheckCircle className="h-3 w-3" /> : 
           sensor.status === "warning" ? <AlertTriangle className="h-3 w-3" /> : 
           <AlertOctagon className="h-3 w-3" />}
          {sensor.status}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {sensor.value.toFixed(1)}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{sensor.unit}</span>
          {sensor.trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : sensor.trend === "down" ? (
            <TrendingDown className="h-4 w-4 text-red-600" />
          ) : (
            <span className="h-4 w-4 text-gray-400">–</span>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Optimal: {sensor.optimal} {sensor.unit}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Range</span>
          <span>{sensor.min} - {sensor.max} {sensor.unit}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(sensor.value, sensor.min, sensor.max)}`}
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {new Date(sensor.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// Component: ActuatorCard
const ActuatorCard = ({ actuator, onToggle }: { actuator: Actuator, onToggle: (id: number, status: Actuator["status"]) => void }) => {
  const getIcon = (type: Actuator["type"]) => {
    switch (type) {
      case "pump": return Droplet;
      case "valve": return Settings;
      case "light": return Sun;
      case "fan": return Wind;
      case "heater": return ThermometerSun;
      case "cooler": return Snowflake;
      case "gate": return Shield;
      case "alarm": return Bell;
      default: return Power;
    }
  };

  const getStatusColor = (status: Actuator["status"]) => {
    switch (status) {
      case "on": return "text-green-600 dark:text-green-400";
      case "off": return "text-red-600 dark:text-red-400";
      case "auto": return "text-blue-600 dark:text-blue-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const Icon = getIcon(actuator.type);

  return (
    <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${
            actuator.status === "on" ? "bg-green-100 dark:bg-green-900/20" :
            actuator.status === "off" ? "bg-red-100 dark:bg-red-900/20" :
            "bg-blue-100 dark:bg-blue-900/20"
          }`}>
            <Icon className={`h-5 w-5 ${
              actuator.status === "on" ? "text-green-600 dark:text-green-400" :
              actuator.status === "off" ? "text-red-600 dark:text-red-400" :
              "text-blue-600 dark:text-blue-400"
            }`} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{actuator.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{actuator.type}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          actuator.status === "on" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
          actuator.status === "off" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {actuator.status === "on" ? <CheckCircle className="h-3 w-3" /> :
           actuator.status === "off" ? <XCircle className="h-3 w-3" /> :
           <Settings className="h-3 w-3" />}
          {actuator.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Power Usage</span>
          <span className="font-bold">{actuator.power}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              actuator.power > 80 ? "bg-red-500" :
              actuator.power > 50 ? "bg-yellow-500" :
              "bg-green-500"
            }`}
            style={{ width: `${actuator.power}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(actuator.id, "auto")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            actuator.status === "auto" 
              ? "bg-blue-600 text-white" 
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          AUTO
        </button>
        <button
          onClick={() => onToggle(actuator.id, "on")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            actuator.status === "on" 
              ? "bg-green-600 text-white" 
              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          ON
        </button>
        <button
          onClick={() => onToggle(actuator.id, "off")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            actuator.status === "off" 
              ? "bg-red-600 text-white" 
              : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          OFF
        </button>
      </div>

      {actuator.schedule && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
            <span className={`font-medium ${actuator.schedule.enabled ? "text-green-600" : "text-gray-500"}`}>
              {actuator.schedule.enabled ? "Active" : "Inactive"}
            </span>
          </div>
          {actuator.schedule.enabled && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {actuator.schedule.startTime} - {actuator.schedule.endTime}
              <div className="mt-1 flex flex-wrap gap-1">
                {actuator.schedule.days.map(day => (
                  <span key={day} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component: WeatherWidget
const WeatherWidget = ({ weather }: { weather: WeatherData }) => {
  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny": return Sun;
      case "cloudy": return Cloud;
      case "rainy": return CloudRain;
      case "stormy": return CloudLightning;
      case "snowy": return Snowflake;
      default: return Cloud;
    }
  };

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white dark:border-blue-700">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Current Weather</h3>
          <p className="text-blue-100">{weather.description}</p>
        </div>
        <WeatherIcon className="h-12 w-12 text-yellow-300" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-4xl font-bold mb-1">{weather.temperature}°C</div>
          <div className="text-sm text-blue-100">Feels like {weather.feelsLike}°C</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{weather.sunrise} ↑</div>
          <div className="text-sm text-blue-100">Sunrise</div>
          <div className="text-lg font-bold mt-2">{weather.sunset} ↓</div>
          <div className="text-sm text-blue-100">Sunset</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-blue-400 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="text-lg font-bold">{weather.humidity}%</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span className="text-sm">Wind</span>
          </div>
          <div className="text-lg font-bold">{weather.windSpeed} km/h</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4" />
            <span className="text-sm">Pressure</span>
          </div>
          <div className="text-lg font-bold">{weather.pressure} hPa</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Umbrella className="h-4 w-4" />
            <span className="text-sm">UV Index</span>
          </div>
          <div className="text-lg font-bold">{weather.uvIndex}/10</div>
        </div>
      </div>
    </div>
  );
};

// Component: AlertCard
const AlertCard = ({ alert, onResolve }: { alert: Alert, onResolve: (id: number) => void }) => {
  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "critical": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning": return AlertTriangle;
      case "critical": return AlertOctagon;
      case "info": return Bell;
      default: return Bell;
    }
  };

  const Icon = getAlertIcon(alert.type);

  return (
    <div className={`rounded-lg border p-4 ${getAlertColor(alert.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 mt-0.5 ${
            alert.type === "warning" ? "text-yellow-600" :
            alert.type === "critical" ? "text-red-600" :
            "text-blue-600"
          }`} />
          <div>
            <p className="font-medium">{alert.message}</p>
            <p className="text-sm opacity-75 mt-1">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        {!alert.resolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="rounded-lg bg-white px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Resolve
          </button>
        )}
      </div>
      {alert.resolved && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-700 dark:text-green-400">Resolved</span>
        </div>
      )}
    </div>
  );
};

// Component: AIAssistant
const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on current sensor data, I recommend adjusting irrigation in Field A. Soil moisture is at 42% (optimal is 50-60%). Consider increasing watering duration by 15 minutes.",
        "Weather forecast shows 30% chance of rain tomorrow. You can reduce irrigation by 20% to conserve water while maintaining optimal soil moisture levels.",
        "The pH level in your hydroponic system is trending downward (6.8). Optimal range is 6.5-7.0. Add pH buffer solution to maintain nutrient absorption efficiency.",
        "Temperature in Greenhouse 1 is optimal at 25.4°C. Maintain current settings for tomato growth. Nighttime temperatures should not drop below 18°C.",
        "CO2 levels are at 420ppm - ideal for photosynthesis. Consider increasing to 600-800ppm during peak daylight hours for enhanced growth rates."
      ];
      setResponse(aiResponses[Math.floor(Math.random() * aiResponses.length)]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
          {/* < className="h-6 w-6 text-white" /> */}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Farm AI Assistant</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Get intelligent insights for your farm</p>
        </div>
      </div>

      {response && (
        <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex gap-3">
            {/* <Robot className="h-5 w-5 text-purple-600 dark:text-purple-400" /> */}
            <div>
              <p className="text-gray-900 dark:text-white">{response}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Analysis based on current sensor data and weather conditions
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about irrigation, fertilization, crop health, weather impact..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ask about farm operations, get recommendations
          </div>
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 font-medium text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Thinking...
              </span>
            ) : (
              "Ask AI"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => setQuestion("What's the optimal watering schedule?")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          💧 Watering
        </button>
        <button
          onClick={() => setQuestion("Should I fertilize this week?")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          🌱 Fertilization
        </button>
        <button
          onClick={() => setQuestion("How is weather affecting my crops?")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          🌤️ Weather
        </button>
        <button
          onClick={() => setQuestion("Any pest or disease alerts?")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          🐛 Pests
        </button>
      </div>
    </div>
  );
};

export default function IoTControlsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>(initialSensorData);
  const [actuators, setActuators] = useState<Actuator[]>(initialActuators);
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeatherData);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Chart data
  const temperatureData = [
    { time: '00:00', temp: 18 },
    { time: '04:00', temp: 16 },
    { time: '08:00', temp: 22 },
    { time: '12:00', temp: 26 },
    { time: '16:00', temp: 25 },
    { time: '20:00', temp: 20 },
    { time: '24:00', temp: 18 },
  ];

  const moistureData = [
    { location: 'Field A', moisture: 42 },
    { location: 'Field B', moisture: 65 },
    { location: 'Greenhouse 1', moisture: 58 },
    { location: 'Greenhouse 2', moisture: 72 },
    { location: 'Orchard', moisture: 48 },
  ];

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Auto-refresh data
    if (autoRefresh) {
      const refreshInterval = setInterval(() => {
        setSensorData(prev => prev.map(sensor => ({
          ...sensor,
          value: sensor.value + (Math.random() - 0.5) * 2,
          timestamp: new Date().toISOString()
        })));
        setWeatherData(prev => ({
          ...prev,
          temperature: prev.temperature + (Math.random() - 0.5) * 0.5
        }));
      }, 10000);

      return () => {
        clearInterval(refreshInterval);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [autoRefresh]);

  const handleActuatorToggle = (id: number, status: Actuator["status"]) => {
    setActuators(prev => prev.map(actuator => 
      actuator.id === id ? { ...actuator, status, lastAction: new Date().toISOString() } : actuator
    ));
    toast.success(`${actuators.find(a => a.id === id)?.name} set to ${status.toUpperCase()}`);
  };

  const handleResolveAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast.success("Alert resolved");
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === "critical");

  if (isLoading) {
    return <IoTLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
        <div className="p-4 md:p-6 pt-20 lg:pt-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50">
                  IoT Farm Control Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time monitoring and control of farm sensors and actuators
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {autoRefresh ? 'Live updating' : 'Paused'}
                  </span>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Pause Updates' : 'Resume Updates'}
                </button>
              </div>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          {criticalAlerts.length > 0 && (
            <div className="mb-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="h-6 w-6" />
                  <div>
                    <h3 className="font-bold">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</h3>
                    <p className="text-sm text-red-100">
                      {criticalAlerts[0].message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAlerts(prev => prev.map(alert => ({ ...alert, resolved: true })));
                    toast.success("All alerts resolved");
                  }}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Resolve All
                </button>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Sensors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{sensorData.length}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  All systems operational
                </span>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAlerts.length}</p>
                </div>
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                {criticalAlerts.length > 0 ? `${criticalAlerts.length} critical` : 'No critical alerts'}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Actuators Online</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {actuators.filter(a => a.status !== 'off').length}/{actuators.length}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                  <Power className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                {actuators.filter(a => a.status === 'auto').length} in auto mode
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Power Consumption</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {actuators.reduce((sum, a) => sum + a.power, 0)}%
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Total system load
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Sensors & Weather */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sensor Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Farm Sensors</h2>
                  <button
                    onClick={() => {
                      setSensorData([...sensorData]);
                      toast.success("Sensor data refreshed");
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sensorData.map(sensor => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               
              </div>
            </div>

            {/* Right Column: Controls, Weather, AI */}
            <div className="space-y-6">
              {/* Weather Widget */}
            

              {/* Actuator Controls */}
              <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Actuator Controls</h2>
                <div className="space-y-4">
                  {actuators.map(actuator => (
                    <ActuatorCard 
                      key={actuator.id} 
                      actuator={actuator}
                      onToggle={handleActuatorToggle}
                    />
                  ))}
                </div>
              </div>

              {/* AI Assistant */}
            
            </div>
          </div>

          {/* Alerts Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Alerts</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Warning</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Critical</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onResolve={handleResolveAlert}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 font-medium text-gray-900 dark:text-white">No Active Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    All systems are operating normally
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}