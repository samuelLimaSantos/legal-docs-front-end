import { useState, useCallback, FormEvent } from "react";
import { api } from "../../services/api";


type Address = {
  street: string,
  neighborhood: string,
  city: string,
  cep: string,
  state: string,
  number?: number;
}

type Request = {
  name: string;
  nationality: string;
  maritalStatus: string;
  identity: string;
  cpf: string;
  numberOfProcess: string;
  address: Address;
}

const Home = () => {

  const [ cep, setCep ] = useState("");
  const [ address, setAddress ] = useState<Address>({} as Address);
  const [ name, setName ] = useState("");
  const [ nationality, setNationality ] = useState("");
  const [ maritalStatus, setMaritalStatus ] = useState("");
  const [ identity, setIdentity ] = useState("");
  const [ cpf, setCpf ] = useState("");
  const [ numberOfProcess, setNumberOfProcess ] = useState("");
  const [ isAddressFill, setIsAddressFill ] = useState(false);

  const getAddressByCep = useCallback(async () => {
    try {
      const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      setAddress({
        cep,
        city: data.localidade,
        neighborhood: data.bairro,
        state: data.uf,
        street: data.logradouro
      });
      setIsAddressFill(true);
    } catch (error) {
      alert('Informe um CEP válido');
      setIsAddressFill(false);
    }
  }, [cep]);

  const handleGenerateDocument = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    const { data } = await api.post('/procuracao', {
      name,
      nationality,
      maritalStatus,
      identity,
      cpf,
      numberOfProcess,
      address
    }, {
      responseType: 'blob'
    });

    const file = new File([data], 'procuracao.pdf', { type: '.pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = `procuracao ${name}.pdf`;
    link.click();

    // console.log(data.data.blob());
  }, [
    name,
    nationality,
    maritalStatus,
    identity,
    cpf,
    numberOfProcess,
    address
  ]);


  return (
    <div className="container">
      <h1>Legal Docs</h1>

      <form onSubmit={handleGenerateDocument}>
        <fieldset>
          <legend>Gerador de documentos</legend>

          <label htmlFor="type-document">Selecione o tipo de documento:</label>
          <select name="type-document" id="type-document" required>
            <option value="letterOfAttorney">Procuração</option>
          </select>

          <section>
            <label htmlFor="name">Nome:</label>
            <input type="text" name="name" required value={name} onChange={({target}) => setName(target.value)}/>
          </section>

          <section>
            <label htmlFor="nationality">Nacionalidade:</label>
            <input type="text" name="nationality" required value={nationality} onChange={({target}) => setNationality(target.value)}/>
          </section>

          <section>
            <label htmlFor="maritalStatus">Estado cívil:</label>
            <input type="radio" value="solteiro" name="maritalStatus" id="solteiro" required onChange={({target}) => setMaritalStatus(target.value)}/>
            <label htmlFor="solteiro">Solteiro(a)</label>
            <input type="radio" value="casado" name="maritalStatus" id="casado" required onChange={({target}) => setMaritalStatus(target.value)}/>
            <label htmlFor="casado">Casado(a)</label>
            <input type="radio" value="viuvo" name="maritalStatus" id="viuvo" required onChange={({target}) => setMaritalStatus(target.value)}/>
            <label htmlFor="viuvo">Viúvo(a)</label>
          </section>

          <section>
            <label htmlFor="identity">RG:</label>
            <input 
              type="text" 
              name="identity" 
              required 
              value={identity} 
              onChange={({target}) => setIdentity(target.value)}
            />
          </section>

          <section>
            <label htmlFor="cpf">CPF:</label>
            <input 
              type="text" 
              name="cpf" 
              required
              value={cpf} 
              onChange={({target}) => setCpf(target.value)}
            />
          </section>


          <section>
            <label htmlFor="numberOfProcess">Nº do Processo de Habilitação:</label>
            <input 
              type="text" 
              name="numberOfProcess" 
              required
              value={numberOfProcess} 
              onChange={({target}) => setNumberOfProcess(target.value)}
            />
          </section>

          <section>
            <label htmlFor="cep">CEP:</label>
            <input type="text" name="cep" value={cep} onChange={({target}) => setCep(target.value)} onBlur={getAddressByCep} required/>
          </section>

          <section>
            <label htmlFor="street">Rua:</label>
            <input type="text" name="street" disabled value={address.street} required/>
          </section>

          <section>
            <label htmlFor="number">Número:</label>
            <input type="number" name="number" value={address.number} accept="number" onChange={({target}) => {
              setAddress({...address, number: parseInt(target.value)})
            }}  required/>
          </section>

          <section>
            <label htmlFor="neighborhood">Bairro:</label>
            <input type="text" name="neighborhood" disabled value={address.neighborhood} required/>
          </section>

          <section>
            <label htmlFor="city">Cidade:</label>
            <input type="text" name="city" disabled value={address.city} required/>
          </section>

          <section>
            <label htmlFor="state">Estado:</label>
            <input type="text" name="state" disabled value={address.state} required/>
          </section>
        </fieldset>


        <button type="submit">Gerar documento</button>
      </form>

    </div>
  )
}


export { Home };