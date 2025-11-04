import React, { useState } from 'react';
import { TextInput } from 'react-native';
import AppView from '../common/AppView';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';

export default function NoteInputSection() {
  const [note, setNote] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const quickNotes = [
    'Đón đúng giờ',
    'Xe 7 chỗ',
    'Không ngồi ghế cuối',
    'Thân thiện, hỗ trợ hành lý',
    'Xe mới, sạch sẽ',
  ];

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
      setNote(updatedText.trim());
    } else {
      // ➕ Nếu chưa chọn → thêm vào
      setSelectedNotes(prev => [...prev, item]);
      const separator = note.trim().length > 0 ? ', ' : '';
      setNote(prev => prev + separator + item);
    }
  };

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
          {quickNotes.map((item, index) => {
            const isActive = selectedNotes.includes(item);
            return (
              <AppButton
                key={index}
                onPress={() => handleAddNote(item)}
                borderWidth={1}
                borderColor={
                  isActive ? ColorsGlobal.main : ColorsGlobal.borderColor
                }
                backgroundColor={
                  isActive ? ColorsGlobal.main + '15' : 'transparent'
                }
                paddingVertical={4}
                paddingHorizontal={12}
                radius={99}
              >
                <AppText
                  fontStyle="italic"
                  color={isActive ? ColorsGlobal.main : ColorsGlobal.textLight}
                  fontSize={14}
                >
                  {item}
                </AppText>
              </AppButton>
            );
          })}
        </AppView>
      </AppView>
    </AppView>
  );
}
