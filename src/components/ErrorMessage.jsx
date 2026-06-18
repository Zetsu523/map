export default function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <h2>Impossible de charger le globe</h2>
      <p>{message}</p>
    </div>
  );
}
