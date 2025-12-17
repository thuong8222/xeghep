import { useRoute } from '@react-navigation/native';
import Container from '../../components/common/Container';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import moment from 'moment';

export default function DetailNotificationScreen() {
  const route = useRoute();
  const { data } = route.params;

  return (
    <Container>
      <AppText bold fontSize={18}>
        {data.title}
      </AppText>
      <AppText
        fontSize={12}
        color={ColorsGlobal.textLight}
        style={{ marginTop: 10 }}
      >
        {moment(data.created_at).format('DD/MM/YYYY HH:mm')}
      </AppText>
      <AppText style={{ marginTop: 12 }}>
        {data.content}
      </AppText>

      
    </Container>
  );
}
