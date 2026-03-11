import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const mockPatients = [
  { id: 1, name: "Talita Bueno" },
  { id: 2, name: "Alvena Watsica" },
  { id: 4, name: "Hipolito Crona" },
];

const mockReports = {
  diet: {
    1: {
      weight: [
        { date: "01/04", value: 82 },
        { date: "01/05", value: 80 },
        { date: "01/06", value: 79 },
      ],
      calories: [
        { date: "01/04", value: 2600 },
        { date: "01/05", value: 2450 },
        { date: "01/06", value: 2300 },
      ],
      tmb: [
        { date: "01/04", value: 1850 },
        { date: "01/05", value: 1820 },
        { date: "01/06", value: 1800 },
      ],
      bodyFat: [
        { date: "01/04", value: 24 },
        { date: "01/05", value: 22 },
        { date: "01/06", value: 20 },
      ],
    },
    2: {
      weight: [
        { date: "01/04", value: 71 },
        { date: "01/05", value: 70 },
        { date: "01/06", value: 69 },
      ],
      calories: [
        { date: "01/04", value: 2800 },
        { date: "01/05", value: 2700 },
        { date: "01/06", value: 2550 },
      ],
      tmb: [
        { date: "01/04", value: 1700 },
        { date: "01/05", value: 1690 },
        { date: "01/06", value: 1680 },
      ],
      bodyFat: [
        { date: "01/04", value: 28 },
        { date: "01/05", value: 27 },
        { date: "01/06", value: 25 },
      ],
    },
    4: {
      weight: [
        { date: "01/04", value: 114 },
        { date: "01/05", value: 113 },
        { date: "01/06", value: 111 },
      ],
      calories: [
        { date: "01/04", value: 3000 },
        { date: "01/05", value: 2900 },
        { date: "01/06", value: 2800 },
      ],
      tmb: [
        { date: "01/04", value: 2200 },
        { date: "01/05", value: 2170 },
        { date: "01/06", value: 2150 },
      ],
      bodyFat: [
        { date: "01/04", value: 31 },
        { date: "01/05", value: 29 },
        { date: "01/06", value: 27 },
      ],
    },
  },

  workout: {
    1: {
      weight: [
        { date: "01/04", value: 82 },
        { date: "01/05", value: 83 },
        { date: "01/06", value: 84 },
      ],
      loads: [
        { date: "01/04", value: 40 },
        { date: "01/05", value: 45 },
        { date: "01/06", value: 50 },
      ],
      repetitions: [
        { date: "01/04", value: 10 },
        { date: "01/05", value: 12 },
        { date: "01/06", value: 14 },
      ],
      bodyFat: [
        { date: "01/04", value: 24 },
        { date: "01/05", value: 23 },
        { date: "01/06", value: 22 },
      ],
    },
    2: {
      weight: [
        { date: "01/04", value: 71 },
        { date: "01/05", value: 72 },
        { date: "01/06", value: 73 },
      ],
      loads: [
        { date: "01/04", value: 20 },
        { date: "01/05", value: 25 },
        { date: "01/06", value: 30 },
      ],
      repetitions: [
        { date: "01/04", value: 8 },
        { date: "01/05", value: 10 },
        { date: "01/06", value: 12 },
      ],
      bodyFat: [
        { date: "01/04", value: 28 },
        { date: "01/05", value: 27 },
        { date: "01/06", value: 26 },
      ],
    },
    4: {
      weight: [
        { date: "01/04", value: 114 },
        { date: "01/05", value: 112 },
        { date: "01/06", value: 110 },
      ],
      loads: [
        { date: "01/04", value: 60 },
        { date: "01/05", value: 70 },
        { date: "01/06", value: 80 },
      ],
      repetitions: [
        { date: "01/04", value: 6 },
        { date: "01/05", value: 8 },
        { date: "01/06", value: 10 },
      ],
      bodyFat: [
        { date: "01/04", value: 31 },
        { date: "01/05", value: 28 },
        { date: "01/06", value: 26 },
      ],
    },
  },
};

function ChartCard({ title, data, unit = "" }) {
  return (
    <div>
      <h3 className="font-serif text-[18px] mb-2">{title}</h3>

      <div className="bg-white rounded-md p-4 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={34}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} ${unit}`.trim(), title]} />
            <Bar dataKey="value" fill="#d6d6d6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Reports() {
  const [selectedPatient, setSelectedPatient] = useState("1");
  const [selectedType, setSelectedType] = useState("diet");

  const selectedData = useMemo(() => {
    return (
      mockReports[selectedType]?.[selectedPatient] ?? {}
    );
  }, [selectedPatient, selectedType]);

  const chartConfig = useMemo(() => {
    if (selectedType === "diet") {
      return [
        {
          title: "Peso",
          data: selectedData.weight ?? [],
          unit: "kg",
        },
        {
          title: "Calorias",
          data: selectedData.calories ?? [],
          unit: "kcal",
        },
        {
          title: "TMB",
          data: selectedData.tmb ?? [],
          unit: "kcal",
        },
        {
          title: "Gordura Corporal",
          data: selectedData.bodyFat ?? [],
          unit: "%",
        },
      ];
    }

    return [
      {
        title: "Peso",
        data: selectedData.weight ?? [],
        unit: "kg",
      },
      {
        title: "Cargas",
        data: selectedData.loads ?? [],
        unit: "kg",
      },
      {
        title: "Repetições",
        data: selectedData.repetitions ?? [],
        unit: "rep",
      },
      {
        title: "Gordura Corporal",
        data: selectedData.bodyFat ?? [],
        unit: "%",
      },
    ];
  }, [selectedData, selectedType]);

  return (
    <div className="w-full">
      <h1 className="text-center font-serif text-5xl uppercase tracking-wide mb-8">
        RELATÓRIOS
      </h1>

      <div className="bg-[#d9d9d9] rounded-2xl p-6 md:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block font-serif text-[18px] mb-2">
              Paciente
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            >
              {mockPatients.map((patient) => (
                <option key={patient.id} value={String(patient.id)}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            >
              <option value="diet">Dieta</option>
              <option value="workout">Treino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {chartConfig.map((chart) => (
            <ChartCard
              key={chart.title}
              title={chart.title}
              data={chart.data}
              unit={chart.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}