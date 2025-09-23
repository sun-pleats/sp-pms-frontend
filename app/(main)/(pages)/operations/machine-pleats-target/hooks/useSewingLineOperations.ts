import { OperatorProcessService } from '@/app/services/OperatorProcessService';
import { OperatorProcess } from '@/app/types/operator';
import { generateSimpleId } from '@/app/utils';
import { SelectItem } from 'primereact/selectitem';
import { useState } from 'react';

export const useSewingLineOperations = () => {
  const [selectedOperatorProcess, setSelectedOperatorProcess] = useState<OperatorProcess | undefined>();
  const [operatorsProcess, setOperatorsProcess] = useState<OperatorProcess[]>([]);
  const [operatorsOption, setOperatorsOption] = useState<SelectItem[]>([
    { label: 'Process 1', value: '1' },
    { label: 'Process 2', value: '2' }
  ]);

  const [processOptions, setProcessOptions] = useState<SelectItem[]>([
    { label: 'Process 1', value: '1' },
    { label: 'Process 2', value: '2' }
  ]);

  const [sewingLineOptions, setSewingLineOptions] = useState<SelectItem[]>([
    { label: 'SW 1', value: '1' },
    { label: 'SW 2', value: '2' }
  ]);

  const [shiftOptions, setShiftOptions] = useState<SelectItem[]>([
    { label: '08:00 - 18:00', value: '1' },
    { label: '19:00 - 23:00', value: '2' }
  ]);

  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': true
  });

  const onAddOperatorClick = () => {
    const id = generateSimpleId();
    setEditingRows({
      ...editingRows,
      [id]: true
    });
    setOperatorsProcess([
      ...operatorsProcess,
      {
        id,
        process_id: '1',
        operator_id: '4',
        operator: {
          id: '1',
          name: 'Operator 4'
        }
      }
    ]);
  };

  const onProcessDeleteClick = (id: any) => {
    setOperatorsProcess(operatorsProcess.filter((e) => e.id != id));
  };

  const fetchProcesses = async () => {
    const data = await OperatorProcessService.getProcesses();
    setOperatorsProcess(data);
  };

  const fetchProcess = async (process_id: any) => {
    return await OperatorProcessService.getProcess(process_id);
  };

  return {
    onAddOperatorClick,
    onProcessDeleteClick,
    setOperatorsProcess,
    setEditingRows,
    setSelectedOperatorProcess,
    operatorsOption,
    processOptions,
    sewingLineOptions,
    shiftOptions,
    operatorsProcess,
    editingRows,
    selectedOperatorProcess,
    fetchProcesses,
    fetchProcess
  };
};
