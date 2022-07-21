import { o } from "ramda";
import React, { useEffect, useState } from "react";
import { useRuntime } from "vtex.render-runtime";

const BeeCoins = () => {
  const [clientId, setClientId] = useState(null);
  const [order, setORder] = useState();
  const [user, setUser] = useState();
  const [saldo, setSaldo] = useState();
  const [debit, setDebit] = useState();

  const { query } = useRuntime();

  useEffect(() => {
    getUser();
    getOrder();
    getSaldo();

    if (order && saldo == 0) {
      postSaldo();
    } else if (saldo) {
      postSaldoDebit();
    }
  }, []);

  async function getUser() {
    try {
      const response = await fetch("/api/sessions?items=*", {
        method: "GET",
      });
      const data = await response.json();

      setClientId(data?.namespaces?.profile?.email?.value);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOrder() {
    try {
      const response = await fetch(`/api/oms/pvt/orders/${query.og}-01`, {
        method: "GET",
      });
      const data = await response.json();

      setORder(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSaldo() {
    try {
      const response = await fetch(`18.230.108.143:4000/saldo`, {
        method: "GET",
        body: JSON.stringify({ id: clientId }),
      });
      const data = await response.json();
      setSaldo(data);
    } catch (error) {
      criaUser();
    }
  }
  async function criaUser() {
    try {
      const responses = await fetch(`18.230.108.143:4000/criauser`, {
        method: "POST",
        body: JSON.stringify({ id: clientId, credit: "0" }),
      });
      const data1 = await responses.json();
      setUser(data1);
    } catch (error) {
      console.log(error);
    }
  }

  async function postSaldo() {
    try {
      const responses = await fetch(`18.230.108.143:4000/depositar`, {
        method: "POST",
        body: JSON.stringify({ id: clientId, credit: valor }),
      });
      const data = await responses.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postSaldoDebit() {
    try {
      const responses = await fetch(`18.230.108.143:4000/debitar`, {
        method: "POST",
        body: JSON.stringify({ id: clientId, credit: valor }),
      });
      const data = await responses.json();
      setDebit(data);
    } catch (error) {
      console.log(error);
    }
  }

  const valor = Math.trunc(order?.value ?? 0 / 100);

  if (clientId) {
    return (
      <div>
        <p> Seus Beecoins {saldo ? saldo : "00"} </p>
      </div>
    );
  }

  return null;
};
export default BeeCoins;
