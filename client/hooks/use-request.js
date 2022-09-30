import { useState } from "react";
import axios from "axios";

export default ({ url, method, data, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, data);
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.log("error : ", error);
      setErrors(
        <div className="mt-2 alert alert-danger">
          <h4>Opsss....</h4>
          <ul>
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
