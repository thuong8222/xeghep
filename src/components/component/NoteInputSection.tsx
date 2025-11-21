import React, { useState } from 'react';
import { TextInput } from 'react-native';
import AppView from '../common/AppView';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import QuickNoteButton from './QuickNoteButton';
import { CONSTANT } from '../../utils/Helper';
interface NoteInputSectionProps {
  onNoteChange?: (note?: string) => void;
}
export default function NoteInputSection({onNoteChange }:NoteInputSectionProps) {
  const [note, setNote] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showAllNotes, setShowAllNotes] = useState(false); 

  const handleAddNote = (item: string) => {
    const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape ký tự đặc biệt trong regex

    if (selectedNotes.includes(item)) {
      // 🧹 Nếu đã chọn rồi → bỏ chọn & xóa khỏi input
      const updatedNotes = selectedNotes.filter(n => n !== item);
      setSelectedNotes(updatedNotes);

      // 🧠 Regex xử lý chuẩn mọi vị trí (đầu / giữa / cuối)
      const regex = new RegExp(
        `(^${escaped}\\s*,\\s*|,\\s*${escaped}$|,\\s*${escaped}(?=,)|^${escaped}$)`,
        'g'
      );

      let updatedText = note.replace(regex, '').replace(/\s+,/g, ',').replace(/,\s+/g, ',');
      updatedText = updatedText.replace(/^,\s*|\s*,$/g, ''); // loại bỏ dấu phẩy thừa đầu/cuối
        /** 👉 Trả ra component cha */
        onNoteChange?.(updatedText);
      setNote(updatedText.trim());
    } else {
      // // ➕ Nếu chưa chọn → thêm vào
      // setSelectedNotes(prev => [...prev, item]);
      // const separator = note.trim().length > 0 ? ', ' : '';
      
      // setNote(prev => prev + separator + item);
      const newValue = note.trim().length > 0 ? `${note}, ${item}` : item;

      setSelectedNotes(prev => [...prev, item]);
      setNote(newValue);

      /** 👉 Trả ra component cha */
      onNoteChange?.(newValue);
      
    }
  };
 // Giới hạn số Quick Note hiển thị ban đầu
 const displayedNotes = showAllNotes ? CONSTANT.QUIKCK_NOTE : CONSTANT.QUIKCK_NOTE.slice(0, 6);

  return (
    <AppView
      borderTopWidth={1}
      paddingTop={18}
      borderTopColor={ColorsGlobal.borderColor}
      width="100%"
    >
      {/* Input ghi chú */}
      <AppView width="100%" alignItems="flex-start" justifyContent="flex-start">
        <TextInput
          value={note ? `Ghi chú: ${note}` : ''}
          onChangeText={(text) => {
            // Nếu người dùng sửa thủ công thì loại bỏ "Ghi chú: " đi
            const clean = text.replace(/^Ghi chú:\s*/i, '');
            onNoteChange?.(clean);
            setNote(clean);
          }}
          placeholder="Ghi chú: Nhập ghi chú...."
          multiline
          style={{
            width: '100%',
            minHeight: 80,
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: ColorsGlobal.borderColor,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            color: ColorsGlobal.textDark,
            fontStyle: 'italic',
          }}
        />

        {/* Gợi ý ghi chú nhanh */}
        <AppView marginTop={18} row gap={8} flexWrap="wrap">
          {displayedNotes.map((item, index) => (
            <QuickNoteButton
              key={index}
              label={item}
              isActive={selectedNotes.includes(item)}
              onPress={() => handleAddNote(item)}
              fontStyle="normal" // 👈 truyền tùy ý: 'italic' | 'normal'
            />
          ))}
                    {/* Nút Xem thêm / Thu gọn */}
                    {CONSTANT.QUIKCK_NOTE.length > 6 && (
            <AppButton
              onPress={() => setShowAllNotes(!showAllNotes)}
              style={{ paddingHorizontal: 8, paddingVertical: 4 }} 
            >
              <AppText fontWeight={700} fontSize={14} style={{ color: ColorsGlobal.main }}>
                {showAllNotes ? '<<< Thu gọn' : 'Xem thêm >>>'}
              </AppText>
            </AppButton>
          )}
        </AppView>

      </AppView>
    </AppView>
  );
}
