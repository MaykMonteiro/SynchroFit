import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

export default function FeedbackView() {
  const nav = useNavigate();
  const location = useLocation();

  const feedback = location.state?.feedback || {};

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-6">
        Feedback
      </h1>

      <section className="bg-sf-panel rounded-md shadow-soft p-8 min-h-[520px] max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <label className="block text-[18px] text-[#333] mb-1">
              Nome Paciente
            </label>
            <div className="w-full h-[42px] bg-white rounded-md px-3 flex items-center text-[16px] text-[#333]">
              {feedback.patient_name || feedback.name || "-"}
            </div>
          </div>

          <div>
            <label className="block text-[18px] text-[#333] mb-1">
              Dieta / Treino
            </label>
            <div className="w-full h-[42px] bg-white rounded-md px-3 flex items-center text-[16px] text-[#333]">
              {feedback.type || feedback.feedback_type || "-"}
            </div>
          </div>

          <div className="col-span-2 max-w-[180px]">
            <label className="block text-[18px] text-[#333] mb-1">
              Data
            </label>
            <div className="w-full h-[42px] bg-white rounded-md px-3 flex items-center text-[16px] text-[#333]">
              {formatDateBR(feedback.date || feedback.created_at)}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[18px] text-[#333] mb-1">
              Comentário
            </label>
            <div className="w-full min-h-[120px] bg-white rounded-md px-3 py-3 text-[16px] text-[#333] whitespace-pre-wrap">
              {feedback.comment || feedback.comentario || feedback.description || "-"}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-16">
          <button
            onClick={() => nav("/feedback")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[18px] px-16 py-2 rounded-md min-w-[260px]"
          >
            VOLTAR
          </button>
        </div>
      </section>
    </div>
  );
}