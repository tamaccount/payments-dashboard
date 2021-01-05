export const fetchPayment = async () => {
  const response = await fetch("http://localhost:8080/payments");
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

export const fetchUsers = async () => {
  const response = await fetch("http://localhost:8080/users");
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

export const postPayment = async payment => {
  return await fetch("http://localhost:8080/payments", {
    method: "POST",
    body: JSON.stringify(payment),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
