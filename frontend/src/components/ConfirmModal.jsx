function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-modal">
        <div className="confirm-model-ornament">✦</div>
        
        <p className="eyebrow">Confirmation required</p>
        <h2>{title}</h2>
        <p className="confirm-modal-message">{message}</p>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="button" className="danger-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;