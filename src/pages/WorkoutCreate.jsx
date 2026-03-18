import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function WorkoutCreate() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [patients, setPatients] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    workout_type_id: "",
    exercise_id: "",
    series: "",
    repetitions: "",
    weight_load: "",
    rest_time: "",
    duration_time: "",
    day_of_week: "1",
    start_date: "",
    end_date: "",
    finalized_at: "",
    send_notification: false,
  });

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function loadOptions() {
    try {
      setLoadingOptions(true);

      const [patientsResponse, workoutTypesResponse, exercisesResponse] =
        await Promise.all([
          api.get("/educators/patient/for-educator"),
          api.get("/educators/workout-type"),
          api.get("/educators/exercises"),
        ]);

      const patientsData =
        patientsResponse.data?.patients ??
        patientsResponse.data?.Patients ??
        patientsResponse.data?.data ??
        patientsResponse.data ??
        [];

      const workoutTypesData =
        workoutTypesResponse.data?.WorkoutTypeData ??
        workoutTypesResponse.data?.data ??
        workoutTypesResponse.data ??
        [];

      const exercisesData =
        exercisesResponse.data?.Exercises ??
        exercisesResponse.data?.ExerciseData ??
        exercisesResponse.data?.data ??
        exercisesResponse.data ??
        [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setWorkoutTypes(Array.isArray(workoutTypesData) ? workoutTypesData : []);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      console.error("Resposta backend:", error.response?.data);
      setPatients([]);
      setWorkoutTypes([]);
      setExercises([]);
    } finally {
      setLoadingOptions(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  const selectedExercise = useMemo(() => {
    return exercises.find(
      (exercise) =>
        String(exercise.exercise_id ?? exercise.id) === String(form.exercise_id)
    );
  }, [exercises, form.exercise_id]);

  const exerciseLink = selectedExercise?.link_exercise ?? "";
  const muscleGroupName = selectedExercise?.muscle_group_name ?? "";

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const workoutPayload = {
        patient_id: Number(form.patient_id),
        workout_type_id: form.workout_type_id
          ? Number(form.workout_type_id)
          : null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        finalized_at: form.finalized_at || null,
      };

      const workoutResponse = await api.post(
        "/educators/workouts",
        workoutPayload
      );

      const createdWorkout = workoutResponse.data?.workout;
      const workoutId = createdWorkout?.id;

      if (!workoutId) {
        throw new Error("Não foi possível obter o ID do treino criado.");
      }

      const workoutItemPayload = {
        workout_id: Number(workoutId),
        exercise_id: Number(form.exercise_id),
        day_of_week: Number(form.day_of_week),
        series: form.series ? Number(form.series) : null,
        repetitions: form.repetitions ? Number(form.repetitions) : null,
        weight_load: form.weight_load ? Number(form.weight_load) : null,
        duration_time: form.duration_time ? Number(form.duration_time) : null,
        rest_time: form.rest_time ? Number(form.rest_time) : null,
        send_notification: form.send_notification,
      };

      await api.post("/educators/workout-items", workoutItemPayload);

      alert("Treino cadastrado com sucesso!");
      nav("/treinos");
    } catch (error) {
      console.error("Erro ao cadastrar treino:", error);
      console.error("Resposta backend:", error.response?.data);
      alert("Não foi possível cadastrar o treino.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    nav("/treinos");
  }

  function getPatientId(patient) {
    return patient.id ?? patient.patient_id;
  }

  function getPatientName(patient) {
    return patient.name ?? patient.nome ?? "Paciente";
  }

  function getWorkoutTypeId(type) {
    return type.id ?? type.workout_type_id;
  }

  function getWorkoutTypeName(type) {
    return type.workout_type ?? type.name ?? "Tipo";
  }

  return (
    <div className="min-h-screen px-8 py-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center font-serif text-[44px] text-[#2f2f2f]">
          CADASTRO DE TREINOS
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-[16px] bg-[#d9d9d9] px-12 py-10 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-x-14 gap-y-5 md:grid-cols-2">
            <Field label="Paciente">
              <select
                value={form.patient_id}
                onChange={(e) => setField("patient_id", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Carregando..." : "Selecione"}
                </option>
                {patients.map((patient) => (
                  <option
                    key={getPatientId(patient)}
                    value={getPatientId(patient)}
                  >
                    {getPatientName(patient)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo de Treino">
              <select
                value={form.workout_type_id}
                onChange={(e) => setField("workout_type_id", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Carregando..." : "Selecione"}
                </option>
                {workoutTypes.map((type) => (
                  <option
                    key={getWorkoutTypeId(type)}
                    value={getWorkoutTypeId(type)}
                  >
                    {getWorkoutTypeName(type)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Exercício">
              <select
                value={form.exercise_id}
                onChange={(e) => setField("exercise_id", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Carregando..." : "Selecione"}
                </option>
                {exercises.map((exercise) => (
                  <option
                    key={exercise.exercise_id ?? exercise.id}
                    value={exercise.exercise_id ?? exercise.id}
                  >
                    {exercise.exercise}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Séries">
              <input
                type="number"
                min="1"
                value={form.series}
                onChange={(e) => setField("series", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </Field>

            <Field label="Repetições">
              <input
                type="number"
                min="1"
                value={form.repetitions}
                onChange={(e) => setField("repetitions", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                
              />
            </Field>

            <Field label="Carga">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.weight_load}
                onChange={(e) => setField("weight_load", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                placeholder="Ex: 20"
              />
            </Field>

            <Field label="Tempo de Descanso">
              <input
                type="number"
                min="0"
                value={form.rest_time}
                onChange={(e) => setField("rest_time", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                placeholder="Em segundos"
              />
            </Field>

            <Field label="Grupo Muscular">
              <input
                type="text"
                value={muscleGroupName}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                readOnly
                placeholder="Será preenchido pelo exercício"
              />
            </Field>

            <Field label="Duração / Tempo">
              <input
                type="number"
                min="0"
                value={form.duration_time}
                onChange={(e) => setField("duration_time", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                placeholder="Em minutos"
              />
            </Field>

            <Field label="Dia da Semana">
              <select
                value={form.day_of_week}
                onChange={(e) => setField("day_of_week", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              >
                <option value="1">Segunda</option>
                <option value="2">Terça</option>
                <option value="3">Quarta</option>
                <option value="4">Quinta</option>
                <option value="5">Sexta</option>
                <option value="6">Sábado</option>
                <option value="7">Domingo</option>
              </select>
            </Field>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Início do Treino">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                required
              />
            </Field>

            <Field label="Fim do Treino">
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setField("end_date", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </Field>

            <Field label="Finalização do Treino">
              <input
                type="date"
                value={form.finalized_at}
                onChange={(e) => setField("finalized_at", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </Field>
          </div>

          <div className="mt-8 max-w-md">
            <Field label="Link:">
              <input
                type="text"
                value={exerciseLink}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                readOnly
                placeholder="Link do exercício"
              />
            </Field>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-[16px] text-[#2f2f2f]">
              <input
                type="checkbox"
                checked={form.send_notification}
                onChange={(e) =>
                  setField("send_notification", e.target.checked)
                }
              />
              Enviar notificação ao paciente
            </label>
          </div>

          <div className="mt-16 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[40px] w-full max-w-[320px] rounded-[5px] border border-[#59b96d] bg-transparent text-[18px] text-[#3ca654] transition hover:bg-[#eef9f0]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || loadingOptions}              
              className="h-[40px] w-full max-w-[320px] hover:bg-sf-btnBlue rounded-[5px] bg-[#8bc79a] text-[18px] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-serif text-[18px] text-[#2f2f2f]">
        {label}
      </span>
      {children}
    </label>
  );
}