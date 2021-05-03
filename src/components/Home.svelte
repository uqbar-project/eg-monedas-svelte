<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { onMount } from 'svelte'
  import type { Conversion } from '../model/conversion'
  import type { Moneda } from '../model/moneda'
  import monedaService from '../service/moneda-service'
  import { toast } from '../service/toast'

  let conversion: Conversion = { monedaAConvertir: '', valorAConvertir: undefined }
  let pesos: number
  let monedas: Moneda[] = []
  let ultimoValorPesos: number
  let ultimoValorMoneda: number
  let ultimaMonedaConversion: string

  onMount(async () => {
    toast.removeLastToast()
    await getMonedas()
    conversion.monedaAConvertir = monedas[0].descripcion
  })
  
  async function getMonedas() {
    try {
      monedas = await monedaService.getMonedas()
    } catch (error) {
      toast.error(error)
    }
  }
  
  async function convertirAPesos() {
    try {
      toast.removeLastToast()
      pesos = await monedaService.convertirAPesos(conversion)
      setUltimosValores()
    } catch (error) {
      toast.error(error)
    }
  }
  
  async function convertirAMoneda() {
    try {
      toast.removeLastToast()
      conversion.valorAConvertir = await monedaService.convertirAMoneda({
        monedaAConvertir: conversion.monedaAConvertir,
        valorAConvertir: pesos,
      })
      setUltimosValores()
    } catch (error) {
      toast.error(error)
    }
  }

  function setUltimosValores() {
    ultimaMonedaConversion = conversion.monedaAConvertir
    ultimoValorMoneda = conversion.valorAConvertir
    ultimoValorPesos = pesos
  }

  $: cambioMoneda = ultimaMonedaConversion != conversion.monedaAConvertir
  $: cambioValorPesos = ultimoValorPesos != pesos
  $: cambioValorMoneda = ultimoValorMoneda != conversion.valorAConvertir
</script>

{#if monedas}
  <div role="main" class="card ancho centrado">
    <div>
      <h1 class="titulo centrado">Conversor de monedas</h1>
    </div>

    <section class="flex">
      <input aria-label="valor moneda" type="number" id="valorMoneda" min="0" bind:value={conversion.valorAConvertir} />
      <select
        aria-label="moneda conversión"
        title={conversion.monedaAConvertir}
        bind:value={conversion.monedaAConvertir}
        id="moneda"
      >
        {#each monedas as moneda}
          <option selected={conversion.monedaAConvertir == moneda.descripcion} value={moneda.descripcion}>
            {moneda.descripcion}
          </option>
        {/each}
      </select>
      <button
        class="convertirAPesos"
        on:click={convertirAPesos}
        disabled={!conversion.monedaAConvertir || !conversion.valorAConvertir || (!cambioValorMoneda && !cambioMoneda)}
        >A Peso Argentino</button
      >
    </section>

    <section class="flex">
      <input aria-label="valor pesos" type="number" id="valorPesos" min="0" bind:value={pesos} />

      <select aria-label="moneda peso argentino" disabled id="pesos">
        <option> Peso Argentino </option>
      </select>
      <button
        class="convertirAMoneda"
        on:click={convertirAMoneda}
        disabled={!pesos || (!cambioValorPesos && !cambioMoneda)}>A {conversion.monedaAConvertir}</button
      >
    </section>

    <SvelteToast options={{ reversed: true, intro: { y: 192 } }} />
  </div>
{/if}

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
  }

  .flex > * {
    margin: 1rem;
  }

  button {
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
  }

  button:disabled {
    color: #cccccc;
    background-color: #4a4a4a;
    font-weight: normal;
    cursor: not-allowed;
  }

  .convertirAPesos {
    background-color: #456480;
  }

  .convertirAMoneda {
    background-color: #810000;
  }

  input {
    height: 3rem;
    padding-left: 1rem;
  }
</style>
